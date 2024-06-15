import torch
from PIL import Image
from torchvision import transforms
#import necessary libraries
import os
import copy
import torch
import numpy as np
import pandas as pd
import torch.nn as nn
import torchvision
from torchvision import models
from sklearn.utils import shuffle
from torchvision import datasets, transforms
from torch.utils.data import Dataset, DataLoader
from PIL import Image
from tqdm import tqdm
import matplotlib.pyplot as plt
import matplotlib.font_manager
from collections import OrderedDict

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

import os
print(os.getcwd())

class Label_encoder:
    def __init__(self, labels):
        labels = list(set(labels))
        self.labels = {label: idx for idx, label in enumerate(classes)}
        # maybe shud be: self.labels = {label: idx for idx, label in enumerate(labels)} ??

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

# saved_model_139_class.pth

# Classify an image
image_path = "./dumplings.jpeg"  # Replace with the path to your image
predicted_label = classify_image(image_path, model, label_encoder, device)
print("Predicted Label:", predicted_label)