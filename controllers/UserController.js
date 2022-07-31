import UserModel from "../models/User.js";
import bcrypt from 'bcrypt';

export const getUser = async (req,res)=>{

    const userId = req.params.id;

    try {
        const user = await UserModel.findById(userId);

        if(user)
        {
            const {password, ...otherDetails} = user._doc;

            res.status(200).json(otherDetails);
        }
        else
        {
            res.status(404).json("User does not exist !");
        }

    }
    catch (error) {
        res.status(500).json({message: error});
    }
}

export const updateUser = async (req,res)=>{
    const id = req.params.id;

    const {currentUserId, isCurrentUserAdmin, password} = req.body;

    try {
        if(currentUserId == id || isCurrentUserAdmin)
        {
            let user = await UserModel.findById(id);

            if(user)
            {
                if(password)
                {
                    const salt = await bcrypt.genSalt(10);
                    req.body.password = await bcrypt.hash(password, salt);
                }

                await UserModel.updateOne(req.body);
                
                res.status(200).json(await UserModel.findById(id));
            }
            else
            {
                res.status(404).json("User does not exist !");
            }
        }
        else 
        {
            res.status(403).json("Access denied! You can only update your own profile.");
        }
    } 
    catch (error) {
        res.status(500).json({message: error});
    }
}

export const deleteUser = async (req,res)=>{
    const {currentUserId, isCurrentUserAdmin} = req.body;
    const id = req.params.id;

    try {
        if(currentUserId == id || isCurrentUserAdmin)
        {
            const user = await UserModel.findById(id);

            if(user)
            {
                await UserModel.deleteOne({_id:id});

                res.status(200).json("User deleted successfully");
            }
            else
            {
                res.status(404).json("User does not exists !");
            }
        }
        else
        {
            res.status(403).json("Access denied! You can only delete your own profile.");
        }
    } 
    catch (error) {
        res.status(500).json({message: error});
    }
}