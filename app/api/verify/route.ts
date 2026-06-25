import { connect } from "@/utils/db";
import User from "@/models/User";
import nodemailer from "nodemailer";
import mongoose from "mongoose";

export async function POST(req: Request) {
    const { userId } = await req.json();
    console.log("Received userId:", userId); 

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return Response.json({ message: "Invalid user ID" }, { status: 400 });
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
        return Response.json({ message: "User not found" }, { status: 404 });
    }

    const bytes = crypto.getRandomValues(new Uint8Array(32));
    const token = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

    await User.updateOne({ _id: userId }, { $set: { verificationToken: token } });

    const verificationLink = `${process.env.NEXTAUTH_URL}/verify/${token}`;

    const transporter = nodemailer.createTransport({
        service: "gmail", 
        auth: {
            user: process.env.WEBSITE_EMAIL,
            pass: process.env.WEBSITE_EMAIL_PASSWORD,
        }
    });

    const mailOptions = {
        from: process.env.WEBSITE_EMAIL,
        to: user.email,
        subject: "Getlancer - Verify Email",
        html: `<p>Click on below link verify your Email:</p>
           <a href="${verificationLink}">${verificationLink}</a>`,
    };

    const result = await transporter.sendMail(mailOptions);

    return Response.json({ message: "Email sent", result });
}

export async function PATCH(req: Request) {
    const { token } = await req.json();
    console.log("Received token:", token);

    if (!token) {
        return Response.json({ message: "Invalid token" }, { status: 400 });
    }

    await connect();

    const user = await User.findOneAndUpdate(
        { verificationToken: token },
        { $set: { isVerified: true } },
        { new: true },
    );

    if (!user) {
        return Response.json({ message: "Invalid token" }, { status: 400 });
    }

    return Response.json({ message: "Email verified successfully" });
}