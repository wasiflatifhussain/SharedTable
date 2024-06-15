import { Request, Response } from "express";
import mongoose from "mongoose";
import cloudinary from "cloudinary";
import User from "../models/user"; // Adjust the path as necessary
import UserAdvertisements from "../models/advertisements"; // Adjust the path as necessary
import Stripe from "stripe";

interface Advertisement {
    imageUrl: string;
    plan: string;
    uniqueId: string;
    issuedDate: Date;
    leftToDisplay: number;
    _id: mongoose.Types.ObjectId;
}

interface UserAdvertisementDocument {
    _id: mongoose.Types.ObjectId;
    userId: string;
    email: string;
    phoneNumber: string;
    advertisements: Advertisement[];
}

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL as string;
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

// Function to upload image to Cloudinary
const uploadImage = async (file: Express.Multer.File): Promise<string> => {
    const image = file;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;

    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
    return uploadResponse.url;
}

const renewUserAdvertisements = async (req: Request, res: Response): Promise<Response> => {
    console.log("found")
    try {
        const { adId } = req.body;

        if (!adId) {
            return res.status(400).json({ success: false, message: "adId is required" });
        }

        // Find the advertisement by adId
        const userAd = await UserAdvertisements.findOne({ "advertisements._id": adId }, { "advertisements.$": 1 });

        if (!userAd || userAd.advertisements.length === 0) {
            return res.status(404).json({ success: false, message: "Advertisement not found" });
        }

        const advertisement = userAd.advertisements[0];
        const plan = advertisement.plan;
        console.log(plan)

        let planPrice = 0;
        if (plan === "20ads") {
            planPrice = 400;
        } else if (plan === "40ads") {
            planPrice = 740;
        } else if (plan === "60ads") {
            planPrice = 1020;
        } else {
            return res.status(400).json({ success: false, message: "Invalid plan" });
        }

        // Create a Stripe payment session
        const session = await STRIPE.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'hkd',
                    product_data: {
                        name: `Advertisement Renewal`,
                    },
                    unit_amount: planPrice * 100,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${FRONTEND_URL}/advertisements`,
            cancel_url: `${FRONTEND_URL}/cancelled`,
            metadata: {
                adId,
                uniqueId: new mongoose.Types.ObjectId().toString(),
                type: 'advertisement-renewal',
            },
        });

        return res.status(200).json({ success: true, url: session.url });
    } catch (error) {
        console.error("Error renewing advertisement:", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
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

        let planPrice = 0;
        if (plan === "20ads") {
            planPrice = 400;
        } else if (plan === "40ads") {
            planPrice = 740;
        } else {
            planPrice = 1020;
        }

        // Create a Stripe payment session
        const session = await STRIPE.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'hkd',
                    product_data: {
                        name: `Advertisement for ${name}`,
                    },
                    unit_amount: planPrice * 100,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${FRONTEND_URL}/advertisements`,
            cancel_url: `${FRONTEND_URL}/cancelled`,
            metadata: {
                userId,
                email,
                phoneNumber,
                plan,
                imageUrl,
                uniqueId: new mongoose.Types.ObjectId().toString(),
                type: 'advertisement',
            },
        });


        // find the checkout code in ordercontroller.ts under strikewebhookhandler
        console.log("Payment session created successfully:", session.url);
        return res.json({ success: true, url: session.url });
    } catch (error) {
        console.error("Error creating advertisement:", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};




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
        let leftToDisplay = 0
        if (newPlan === "20ads") {
            leftToDisplay = 20;
        }
        else if (newPlan === "40ads") {
            leftToDisplay = 40;
        }
        else if (newPlan === "60ads") {
            leftToDisplay = 60;
        }
        const userAdvertisements = await UserAdvertisements.findOneAndUpdate(
            { email, "advertisements._id": advertisementId },
            { $set: { "advertisements.$.plan": newPlan, "advertisements.$.leftToDisplay": leftToDisplay } },
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

const getRandomAdvertisement = async (req: Request, res: Response) => {
    const userEmail = req.query.email as string; // Assuming the user's email is passed as a query parameter

    try {
        let advertisement: Advertisement | null = null;

        while (!advertisement) {
            // Get a random user whose email is not the same as the given user's email
            const randomUser = await UserAdvertisements.aggregate<UserAdvertisementDocument>([
                { $match: { email: { $ne: userEmail } } },
                { $sample: { size: 1 } } // Get a random user
            ]);

            if (randomUser.length === 0) {
                return res.status(404).json({ success: false, message: "No suitable advertisements found" });
            }

            // Get the user's advertisements
            const userAdvertisements = randomUser[0].advertisements;

            // Filter advertisements with leftToDisplay > 0
            const validAdvertisements = userAdvertisements.filter((ad: Advertisement) => ad.leftToDisplay > 0);

            if (validAdvertisements.length === 0) {
                continue; // No valid advertisements for this user, continue to the next random user
            }

            // Select a random advertisement from the valid advertisements
            const randomAdIndex = Math.floor(Math.random() * validAdvertisements.length);
            advertisement = validAdvertisements[randomAdIndex];

            // Decrement leftToDisplay by 1
            advertisement.leftToDisplay -= 1;

            // Update the advertisement in the database
            await UserAdvertisements.updateOne(
                { _id: randomUser[0]._id, "advertisements._id": advertisement._id },
                { $set: { "advertisements.$.leftToDisplay": advertisement.leftToDisplay } }
            );
        }

        return res.status(200).json({ success: true, advertisement });
    } catch (error) {
        console.error("Error fetching random advertisement:", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};

export default {
    createAdvertisement,
    getUserAdvertisements,
    deleteAdvertisement,
    changeAdvertisementPlan,
    getRandomAdvertisement,
    renewUserAdvertisements,
};
