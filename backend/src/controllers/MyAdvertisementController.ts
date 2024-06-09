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

const getUserAdvertisements = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email } = req.body;
        
        if (!email || typeof email !== 'string') {
            console.log("Invalid email");
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        console.log("Finding advertisements for email:", email);

        // Find user advertisements by email
        const userAdvertisements = await UserAdvertisements.findOne({ email });

        if (!userAdvertisements) {
            console.log("User advertisements not found");
            return res.status(404).json({ success: false, message: "User advertisements not found" });
        }

        console.log("Advertisements found");

        return res.status(200).json({ success: true, userAdvertisements });
    } catch (error) {
        console.error("Error fetching user advertisements:", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

const deleteAdvertisement = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, advertisementId } = req.body;

        console.log(advertisementId)
        // Use Mongoose method to remove the subdocument
        const result = await UserAdvertisements.updateOne(
            { email },
            { $pull: { advertisements: { _id: advertisementId } } }
        );

        if (result.modifiedCount === 0) {
            console.log("Advertisement not found.");
            return res.status(404).json({ success: false, message: "Advertisement not found" });
        }

        console.log("Advertisement deleted.")
        return res.status(200).json({ success: true, message: "Advertisement deleted" });
    } catch (error) {
        console.error("Error deleting advertisement:");
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

const changeAdvertisementPlan = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, advertisementId, newPlan } = req.body;

        console.log(`Received request to change plan to ${newPlan} for advertisement: ${advertisementId} and email: ${email}`);

        const userAdvertisements = await UserAdvertisements.findOneAndUpdate(
            { email, "advertisements._id": advertisementId },
            { $set: { "advertisements.$.plan": newPlan } },
            { new: true }
        );

        if (!userAdvertisements) {
            return res.status(404).json({ success: false, message: "User advertisements not found" });
        }

        console.log('Advertisement plan changed successfully.');
        return res.status(200).json({ success: true, message: "Advertisement plan changed", userAdvertisements });
    } catch (error) {
        console.error("Error changing advertisement plan:", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

export default {
    createAdvertisement,
    getUserAdvertisements,
    deleteAdvertisement,
    changeAdvertisementPlan,
};
