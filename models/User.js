import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        userName: {
            type : String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        firstName: {
            type : String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        profilePicture: String,
        coverPicture: String,
        about: String,
        livesIn: String,
        country: String,
        worksAt: String,
        relationship: String,
        followers: [],
        following: []
    },
    {timestamps: true}
);

const UserModel = mongoose.model("User",userSchema);

export default UserModel;