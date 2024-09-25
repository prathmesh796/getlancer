import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String, 
            unique: true, 
            required: true,
        },
        email: {
            type: String, 
            unique: true, 
            required: true,
        }, 
        password: {
            type: String, 
            required: true,
        },
        isVerfied: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
)

export const User = mongoose.model.User || mongoose.model("User", userSchema)