import { Request, Response } from "express";
import User from "../models/user";

const createCurrentUser = async (req: Request, res: Response) => {
    // 1. check if user exists
    // 2. create user if not exists
    // 3. return the user object to calling client
    try {
        const {auth0Id} = req.body;
        const existingUser = await User.findOne({ auth0Id });

        if (existingUser) {
            return res.status(200).send();
        }
        else {
            const newUser = new User(req.body);
            await newUser.save();

            res.status(201).json(newUser.toObject()); //201 means successfully created
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Error creating user."})
    }
}

const updateCurrentUser = async (req: Request, res: Response) => {
    try {
        const { name, addressLine1, country, city } = req.body;
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = name;
        user.addressLine1 = addressLine1;
        user.city = city;
        user.country = country;

        await user.save();

        res.send(user);

    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Error updating user"});
    }
}

export default {
    createCurrentUser,
    updateCurrentUser,
};