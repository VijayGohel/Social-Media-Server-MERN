import mongoose from "mongoose";
import PostModel from "../models/Post.js";
import UserModel from "../models/User.js";

export const getPost = async (req,res)=>{
    
    const postId = req.params.id;

    try {
        const post = await PostModel.findById(postId);

        if(post)
        {
            res.status(200).json(post);
        }
        else
        {
            res.status(404).json("Post not found !");
        }
    } catch (error) {
        res.status(500).json({message:error});
    }
}

export const createPost = async (req,res)=>{

    try {
        const post = new PostModel(req.body);
        await post.save();

        res.status(200).json(post);

    } catch (error) {
        res.status(500).json({message:error});    
    }
}

export const updatePost = async (req,res)=>{
    const postId = req.params.id;
    const {currentUser} = req.body;

    try {
        const post = await PostModel.findById(postId);
        console.log(postId + " " + post);
        if(post){
            if(currentUser == post.userId)
            {
                await PostModel.findByIdAndUpdate(postId, req.body);

                res.status(200).json(await PostModel.findById(postId));
            }        
            else
            {
                res.status(403).json("Action forbidden !");
            }
        }
        else
        {
            res.status(404).json("Post not found !");
        }
    } catch (error) {
        res.status(500).json({message: error});
    }
}

export const deletePost = async (req,res)=>{
    const postId = req.params.id;
    const {currentUser} = req.body;
    try {
        const post = await PostModel.findById(postId);

        if(post)
        {
            if(post.userId == currentUser)
            {
                await PostModel.findByIdAndDelete(postId);

                res.status(200).json("Post deleted successfully");
            }
            else
            {
                res.status(403).json("Action forbidden !");
            }
        }
        else
        {
            res.status(404).json("Post not found !");
        }
    } catch (error) {
        res.status(500).json({message: error});
    }
}

export const likePost = async (req,res)=>{
    const postId = req.params.id;
    const {currentUser} = req.body;

    try {
        const post = await PostModel.findById(postId);
        
        if(post)
        {
            if(! post.likes.includes(currentUser))
            {
                await PostModel.findByIdAndUpdate(postId, {$push : {likes: currentUser}});

                res.status(200).json("Post liked successfully");
            }
            else
            {
                await PostModel.findByIdAndUpdate(postId, {$pull : {likes: currentUser}});

                res.status(200).json("Post disliked successfully");
            }
        }
        else
        {
            res.status(404).json("Post not found !");
        }

    } catch (error) {
        res.status(500).json({message: error});
    }
}

export const getTimeline = async (req,res)=>{
    const userId = req.params.id;

    try {
        const currentUserPosts  = await PostModel.find({userId : userId});

        const followingPosts = await UserModel.aggregate([
            {
                $match: { _id : new mongoose.Types.ObjectId(userId)}
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "following",
                    foreignField: "userId",
                    as: "followingPosts"
                }
            },
            {
                $project: {
                    followingPosts: 1,
                    _id: 0
                }
            }
        ])

        res.status(200).json(currentUserPosts.concat(followingPosts[0].followingPosts)
            .sort((a,b)=>b.createdAt - a.createdAt));

    } catch (error) {
        res.status(500).json({message: error});
    }
}