import { Request, Response } from "express";
import mongoose from "mongoose";
import cloudinary from "cloudinary";
import User from "../models/user"; // Adjust the path as necessary
import UserAdvertisements from "../models/advertisements"; // Adjust the path as necessary

// Function to upload image to Cloudinary
const uploadImage = async (file: Express.Multer.File): Promise<string> => {
    const image = file;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;

    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
    return uploadResponse.url;
}

const createAdvertisement = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, phone, countryCode, name, plan } = req.body;
        const file = req.file as Express.Multer.File;

        // Upload image to Cloudinary
        const imageUrl = await uploadImage(file);

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const userId = user._id.toString();
        const phoneNumber = `${countryCode}${phone}`;

        // Check if user advertisement entry exists
        let userAdvertisement = await UserAdvertisements.findOne({ email, userId });

        if (!userAdvertisement) {
            // Create new advertisement entry
            userAdvertisement = new UserAdvertisements({
                userId,
                email,
                phoneNumber,
                advertisements: [{
                    imageUrl,
                    plan,
                    uniqueId: new mongoose.Types.ObjectId().toString()
                }]
            });
        } else {
            // Append new advertisement to existing entry
            userAdvertisement.advertisements.push({
                imageUrl,
                plan,
                uniqueId: new mongoose.Types.ObjectId().toString()
            });
        }

        // Save the advertisement entry
        await userAdvertisement.save();

        return res.status(201).json({ success: true, userAdvertisement });
    } catch (error) {
        console.error("Error creating advertisement:", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

export default {
    createAdvertisement
};
