import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true
    },
    restaurantID: {
        type: String,
        required: true,
    },
    totalDonation: {
        type: Number,
        required: true,
    },
});

const Donations = mongoose.model("Donations", donationSchema);

export default Donations;