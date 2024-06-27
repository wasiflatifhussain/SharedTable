import torch
from PIL import Image
from torchvision import transforms
from flask import Flask, request, jsonify
import torch.nn as nn
import torchvision
from torchvision import models
import os
from flask_cors import CORS
import base64
from io import BytesIO
from pymongo import MongoClient
import random
import base64
from groq import Groq
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes
load_dotenv()

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

mongo_uri = os.getenv('MONGO_URI')
groq_api_key = os.getenv('GROQ_API_KEY')

clientM = MongoClient(mongo_uri)
db = clientM['test'] 

client = Groq(
    api_key=groq_api_key,
)
    

class Label_encoder:
    def __init__(self, labels):
        labels = sorted(list(set(labels))) # sort so that it returns correct idx
        self.labels = {label: idx for idx, label in enumerate(labels)}

    def get_label(self, idx):
        return list(self.labels.keys())[idx]

    def get_idx(self, label):
        return self.labels[label]

def classify_image(image, model, label_encoder, device):
    # Load and preprocess the input image
    # image = Image.open(image_path)
    preprocess = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    image_tensor = preprocess(image).unsqueeze(0).to(device)

    # Perform prediction
    with torch.no_grad():
        model.eval()
        output = model(image_tensor)

    # Get predicted class index
    _, predicted_idx = torch.max(output, 1)
    predicted_idx = predicted_idx.item()

    # Map index to class name
    predicted_label = label_encoder.get_label(predicted_idx)

    return predicted_label

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Ensure the classes are properly defined and passed
classes = open("./food-101-tester/meta/classes.txt", 'r').read().splitlines()
label_encoder = Label_encoder(classes)

# Load the saved model and label encoder
model = models.densenet201(weights=None)
classifier = nn.Sequential(
    nn.Linear(1920, 1024),
    nn.LeakyReLU(),
    nn.Linear(1024, 139),
)
model.classifier = classifier
model.load_state_dict(torch.load("saved_model_139_dictionary_139_class_best.pth", map_location=device))
model.to(device)
model.eval()

# @app.route('/predict', methods=['POST'])
# def predict():

#     if 'file' not in request.files:
#         return jsonify({'error': 'No file provided'}), 400

#     file = request.files['file']
#     image = Image.open(file).convert("RGB")
#     predicted_label = classify_image(image, model, label_encoder, device)
    
#     print("Predicted Label:", predicted_label)

#     return jsonify({'predicted_label': predicted_label})


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if 'image' not in data:
        return jsonify({'error': 'No image provided'}), 400

    # Decode the base64 image
    image_data = data['image']
    image_data = base64.b64decode(image_data)
    image = Image.open(BytesIO(image_data)).convert("RGB")

    predicted_label = classify_image(image, model, label_encoder, device)
    
    print("Predicted Label:", predicted_label)

    return jsonify({'predicted_label': predicted_label})


@app.route('/api/stories/random', methods=['GET'])
def get_random_stories():
    try:
        stories = list(db.stories.find())
        random_stories = random.sample(stories, min(5, len(stories)))
        for story in random_stories:
            story['_id'] = str(story['_id'])  # Convert ObjectId to string
        return jsonify({'stories': random_stories}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/stories/add', methods=['POST'])
def add_story():
    data = request.get_json()
    
    if 'title' not in data or 'story' not in data or 'author' not in data or 'image' not in data:
        return jsonify({'error': 'Missing fields'}), 400
    
    title = data['title']
    story_content = data['story']
    author = data['author']
    image_base64 = data['image']
    
    # Decode the base64 image
    image_data = base64.b64decode(image_base64)
    image = Image.open(BytesIO(image_data)).convert("RGB")

    # Save image to a temporary location (if needed)
    image_path = "./temp_image.jpg"
    image.save(image_path)

    # Check if the story is appropriate using Groq API
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"Tell me if the story below is appropriate or relevant for a website promoting food sustainability and inspiring people. If not appropriate or not relevant, just reply 'NOT' and finish. But if it appropriate, reply with 'APPROPRIATE', and then, fix up the grammar without changing the story and give it to me:  {story_content}",
            }
        ],
        model="llama3-8b-8192",
    )

    if "APPROPRIATE" in chat_completion.choices[0].message.content:
        # Fix the story grammar
        chat_completion2 = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": f"Just give me the story itself and remove all extra stuff from here: {chat_completion.choices[0].message.content}",
                }
            ],
            model="llama3-8b-8192",
        )
        
        # Rate the story
        chat_completion3 = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": f"Rate this story out of 10. No need explanation. Just a rating number as output: {chat_completion2.choices[0].message.content}",
                }
            ],
            model="llama3-8b-8192",
        )
        
        # Prepare story data
        fixed_story = chat_completion2.choices[0].message.content
        rating = chat_completion3.choices[0].message.content

        # Prepare the story entry
        story_entry = {
            "title": title,
            "story": fixed_story,
            "author": author,
            "rating": rating,
            "image": image_base64,
        }
        
        # Insert the story entry into MongoDB
        db.stories.insert_one(story_entry)
        print("here")
        return jsonify({'message': 'Story added successfully'}), 200
    
    else:
        print("oh here")
        return jsonify({'message': 'Story not appropriate'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
