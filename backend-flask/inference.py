import argparse
import torch
from PIL import Image
from torchvision import transforms
import os
import torch
import numpy as np
import pandas as pd
import torch.nn as nn
from torchvision import models
from torchvision import transforms
from PIL import Image

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

class Label_encoder:
    def __init__(self, labels):
        labels = list(set(labels))
        self.labels = {label: idx for idx, label in enumerate(labels)}

    def get_label(self, idx):
        return list(self.labels.keys())[idx]

    def get_idx(self, label):
        return self.labels[label]

def classify_image(image_path, model, label_encoder, device):
    # Load and preprocess the input image
    image = Image.open(image_path)
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

if __name__ == "__main__":
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description="Image classification inference")
    parser.add_argument("image_path", type=str, help="Path to the input image")
    parser.add_argument("model_path", type=str, help="Path to the saved model")
    args = parser.parse_args()

    # Load classes
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
    model.load_state_dict(torch.load(args.model_path, map_location=device))
    model.to(device)
    model.eval()

    # Classify the image
    predicted_label = classify_image(args.image_path, model, label_encoder, device)
    print("Predicted Label:", predicted_label)
