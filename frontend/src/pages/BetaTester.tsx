import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WebcamCapture from "@/components/Webcam";

const API_BASE_URL2 = import.meta.env.VITE_API_BASE_URL_2;

const formatClassName = (className) => {
  return className.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const BetaTester = () => {
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [predictedLabel, setPredictedLabel] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [dragging, setDragging] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleCapture = async (imageSrc) => {
    setCapturedImage(imageSrc);
    await sendImageForPrediction(imageSrc);
  };

  const sendImageForPrediction = async (imageSrc) => {
    try {
      const response = await fetch(`${API_BASE_URL2}/predict`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imageSrc.split(',')[1] })  // Remove base64 prefix
      });

      const data = await response.json();
      if (response.ok) {
        setPredictedLabel(data.predicted_label);
      } else {
        console.error("Prediction error:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageSrc = reader.result;
        setCapturedImage(imageSrc);
        await sendImageForPrediction(imageSrc);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewItemPriceSet = (event) => {
    const val = event.target.value;
    setNewItemPrice(val);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageSrc = reader.result;
        setCapturedImage(imageSrc);
        await sendImageForPrediction(imageSrc);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setDragging(true);
    const fileType = event.dataTransfer.items[0].type;
    if (fileType.startsWith('image/')) {
      setDragOver(true);
    } else {
      setDragOver(false);
    }
  };

  return (
    <div className="container mx-auto p-10 bg-white rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-center text-[#048a52] mb-6">Beta Tester for AI Food Detection</h1>
      <p className="text-lg text-center text-gray-700 mb-8">
        This is our new feature! Be the first to check it out. We use a DenseNet-201 model for image classification.
        <br />
        <strong>Model Details:</strong>
        <br />
        This model is trained for 139 classes of food items using transfer learning. The DenseNet-201 model is pre-trained on the ImageNet dataset, and the final fully connected layer is replaced with a new one for 139 classes.
        <br />
        The model achieves high accuracy in classifying food images across 139 distinct classes.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div 
          className={`bg-white shadow-md rounded-lg p-6 text-center ${dragging ? (dragOver ? 'border-green-500' : 'border-red-500') : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDragEnter={handleDragEnter}
        >
          <h2 className="text-2xl font-bold mb-4">Upload an Image</h2>
          <input 
            type="file" 
            accept="image/*" 
            id="fileInput" 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />
          <label 
            htmlFor="fileInput" 
            className="block border-2 border-dashed border-gray-300 p-6 rounded-lg cursor-pointer hover:border-gray-400"
          >
            <p className="mb-2">Drag & Drop your image here or click to upload</p>
          </label>
          <p style={{marginBottom: "10px", marginTop: "10px"}}>Or</p>
          <Button type="button" onClick={() => document.getElementById('fileInput').click()} className="hover:bg-red-500 hover:text-black">
            Browse Computer
          </Button>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Take a Picture</h2>
          <Button type="button" onClick={() => setIsWebcamOpen(true)} className="hover:bg-red-500 hover:text-black">
            Open Camera
          </Button>
        </div>
      </div>

      {isWebcamOpen && (
        <WebcamCapture 
          onCapture={handleCapture} 
          onClose={() => setIsWebcamOpen(false)} 
        />
      )}
      
      {capturedImage && 
        <div className="text-center mt-4">
          <img src={capturedImage} alt="Captured" className="mx-auto mb-4 border rounded-lg" />
          <p className="text-xl"><b>Detected item: </b>
            {formatClassName(predictedLabel)}
          </p>
        </div>
      }
    </div>
  );
};

export default BetaTester;
