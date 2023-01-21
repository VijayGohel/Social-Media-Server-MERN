import UserModel from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

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

    const {_id, isCurrentUserAdmin, password} = req.body;

    try {
        if(_id == id || isCurrentUserAdmin)
        {
            let user = await UserModel.findById(id);

            if(user)
            {
                if(password)
                {
                    const salt = await bcrypt.genSalt(10);
                    req.body.password = await bcrypt.hash(password, salt);
                }

                const user = await UserModel.findByIdAndUpdate(id, req.body, {
                    new: true,
                });

                const token = jwt.sign(
                    { username: user.username, id: user._id },
                    process.env.JWT_KEY,
                    { expiresIn: "1h" }
                );
                
                res.status(200).json({user, token});
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

export const followUser = async (req,res)=>{
    const followUserId = req.params.id;
    const {followingUserId} = req.body;

    try {
        if(followUserId == followingUserId)
        {
            res.status(403).json("Action forbidden !");
        }
        else
        {
            const followUser = await UserModel.findById(followUserId);
            const followingUser = await UserModel.findById(followingUserId);

            if(!followUser)
            {
                res.status(404).json("User does not exists !");
            }
            else if(!followUser.followers.includes(followingUserId))
            {
                await followUser.updateOne({$push : {followers: followingUserId}});
                await followingUser.updateOne({$push : {following: followUserId}});

                res.status(200).json("User followed !");    
            }
            else
            {
                res.status(403).json("You already follow this user.");
            }
        }
    } catch (error) {
        res.status(500).json({message: error});
    }
}

export const unfollowUser = async (req,res)=>{
    const unfollowUserId = req.params.id;
    const {unfollowingUserId} = req.body;

    try {
        if(unfollowUserId == unfollowingUserId)
        {
            res.status(403).json("Action forbidden !");
        }
        else
        {
            const unfollowUser = await UserModel.findById(unfollowUserId);
            const unfollowingUser = await UserModel.findById(unfollowingUserId);

            if(!unfollowUser)
            {
                res.status(404).json("User does not exists !");
            }
            else if(unfollowUser.followers.includes(unfollowingUserId))
            {
                await unfollowUser.updateOne({$pull : {followers: unfollowingUserId}});
                await unfollowingUser.updateOne({$pull : {following: unfollowUserId}});

                res.status(200).json("User unfollowed !");    
            }
            else
            {
                res.status(403).json("You do not follow this user.");
            }
        }
    } catch (error) {
        res.status(500).json({message: error});
    }
}