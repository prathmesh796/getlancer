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
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
        },
        role: {
            type: String,
            required: true,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordTokenExpiry: {
            type: Date,
        },
    },
    { timestamps: true },
)

// Re-register in dev so schema changes (e.g. new fields) are picked up after hot reload
if (mongoose.models.User) {
    mongoose.deleteModel("User");
}

const User = mongoose.model<User>("User", userSchema);

export default User;