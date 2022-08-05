import UserModel from "../models/User.js";
import bcrypt from "bcrypt";

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
            await newUser.save();
            res.status(200).json(newUser);
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