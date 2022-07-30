import UserModel from "../models/User.js";
import bcrypt from "bcrypt";

export const registerUser = async (req,res) => {

    const {userName , password, firstName, lastName}  = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
            const newUser = new UserModel({
            userName,
            password: hashedPassword,
            firstName,
            lastName
        })

        await newUser.save();

        res.status(200).json(newUser);

    } catch (error) {
        res.status(500).json({message: error});
    }
}