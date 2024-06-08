import mongoose from "mongoose";

// Define the subarray schema for advertisements
const advertisementSchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    plan: { type: String, required: true },
    uniqueId: { type: String, required: true, default: () => new mongoose.Types.ObjectId().toString() },
});

// Define the main schema for advertisements
const userAdvertisementsSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    advertisements: [advertisementSchema],
});

const UserAdvertisements = mongoose.model("UserAdvertisements", userAdvertisementsSchema);

export default UserAdvertisements;
