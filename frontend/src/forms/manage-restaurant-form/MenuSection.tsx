import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormDescription, FormField, FormItem } from "@/components/ui/form";
import { useFieldArray, useFormContext } from "react-hook-form";
import MenuItemInput from "./MenuItemInput";
import WebcamCapture from "@/components/Webcam";
import { Input } from "@/components/ui/input";

const API_BASE_URL2 = import.meta.env.VITE_API_BASE_URL_2;


const formatClassName = (className) => {
    return className.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const MenuSection = () => {
    const { control } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "menuItems",
    });

    const [isWebcamOpen, setIsWebcamOpen] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [predictedLabel, setPredictedLabel] = useState("");
    const [newItemPrice, setNewItemPrice] = useState("");

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

    return (
        <div className="space-y-2 text-[#607523]">
            <div>
                <h2 className="text-2xl font-bold">Menu</h2>
                <FormDescription>
                    Create your menu and give each item a name and a price
                </FormDescription>
            </div>
            <FormField control={control} name="menuItems" render={() => (
                <FormItem className="flex flex-col gap-2">
                    {fields.map((_, index) => (
                        <MenuItemInput 
                            key={index}
                            index={index} 
                            removeMenuItem={() => remove(index)} 
                        />
                    ))}
                </FormItem>
            )} />
            <div style={{display: "flex"}}>
                <Button type="button" onClick={() => append({name: "", price: ""})} className="hover:bg-red-500 hover:text-black">
                    Add menu items manually
                </Button>
                <p style={{marginRight: "10px"}}></p>
                <Button type="button" onClick={() => setIsWebcamOpen(true)} className="hover:bg-red-500 hover:text-black">
                    Add automatically: Take a pic!
                </Button>
                <p style={{marginRight: "10px"}}></p>
                <div>
                    <input 
                        type="file" 
                        accept="image/*" 
                        id="fileInput" 
                        onChange={handleFileChange} 
                        style={{ display: 'none' }} 
                    />
                    <Button 
                        type="button" 
                        onClick={() => document.getElementById('fileInput').click()} 
                        className="hover:bg-red-500 hover:text-black"
                    >
                        Add automatically: Upload Image
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
                <div>
                    <img src={capturedImage} alt="Captured" />
                    <p style={{marginTop: "5px"}}><b>Detected item: </b>
                        {formatClassName(predictedLabel)}
                    </p>
                    <input 
                        type="text" 
                        placeholder="Enter price" 
                        onChange={handleNewItemPriceSet} 
                        value={newItemPrice} 
                        className="border rounded-md p-2 pl-4 mt-2 mb-4 mr-2"
                    />
                    <Button type="button" onClick={() => append({name: formatClassName(predictedLabel), price: newItemPrice})} className="hover:bg-red-500 hover:text-black">
                        Add to Menu
                    </Button>
                </div>
            }
        </div>
    );
};

export default MenuSection;
