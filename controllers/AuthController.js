import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req,res) => {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    try {

        const oldUser = await UserModel.findOne({userName: req.body.userName});

        if(oldUser)
        {
            res.status(400).json("username already exists!");
        }
        else
        {
            const newUser = new UserModel(req.body);
            const user = await newUser.save();

            const token = jwt.sign(
                {userName: user.userName, id: user._id},
                process.env.JWT_KEY,
                {expiresIn: "1h"});

            res.status(200).json({user, token});
        }    

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
            {
                const token = jwt.sign(
                    {userName: user.userName, id: user._id},
                    process.env.JWT_KEY,
                    {expiresIn: "1h"});

                res.status(200).json({user, token});
            }
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