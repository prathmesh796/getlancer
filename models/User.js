import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String, 
            unique: true, 
            required: true,
        },
        name: {
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
        forgotPasswordToken: String,
        forgotPasswordTokenExpiry: Date,
        verifyToken: String,
        verifyTokenExpiry: Date,
    },
)

const User = mongoose.models.users || mongoose.model("User", userSchema)

export default User