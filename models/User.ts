import mongoose from "mongoose";
import type { User } from "@/types/User";

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
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpiry: {
            type: Date,
        },
    },
    { timestamps: true },
)

const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User as mongoose.Model<User>