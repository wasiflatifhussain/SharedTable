# final_inference.py
import sys
import torch
from PIL import Image
from torchvision import transforms
import torch.nn as nn
import torchvision
from torchvision import models

def classify_image(image_path, model, label_encoder, device):
    image = Image.open(image_path).convert("RGB")
    preprocess = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    image_tensor = preprocess(image).unsqueeze(0).to(device)

    with torch.no_grad():
        model.eval()
        output = model(image_tensor)

    _, predicted_idx = torch.max(output, 1)
    predicted_idx = predicted_idx.item()

    predicted_label = label_encoder.get_label(predicted_idx)
    return predicted_label

class Label_encoder:
    def __init__(self, labels):
        labels = list(set(labels))
        self.labels = {label: idx for idx, label in enumerate(labels)}

    def get_label(self, idx):
        return list(self.labels.keys())[idx]

    def get_idx(self, label):
        return self.labels[label]

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

classes = open("./food-101-tester/meta/classes.txt", 'r').read().splitlines()
label_encoder = Label_encoder(classes)

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

if __name__ == "__main__":
    image_path = sys.argv[1]
    predicted_label = classify_image(image_path, model, label_encoder, device)
    print(predicted_label)
