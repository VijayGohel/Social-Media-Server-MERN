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

export const loginUser = async (req,res)=>{
    const {userName , password}  = req.body;

    try {
        const user  = await UserModel.findOne({userName : userName});

        if(user)
        {
            const validate = await bcrypt.compare(password , user.password);

            if(validate)
                res.status(200).json(user);
            else
                res.status(400).json("Password incorrect !"); 
        }
        else
        {
            res.status(404).json("User does not exist !");
        }
    } catch (error) {
        res.status(500).json({message: error});
    }
}