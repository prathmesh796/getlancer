import { connect } from "@/utils/db";
import nodemailer from "nodemailer";
import User from "@/models/User";

export async function POST(req: Request) {
    const { email } = await req.json();
    console.log("Received email:", email); // Log the received email for debugging

    await connect();

    const user = await User.findOne({ email });
    if (!user) {
        return Response.json({ message: "User not found" }, { status: 404 });
    }

    const bytes = crypto.getRandomValues(new Uint8Array(32));
    const token = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

    user.resetPasswordToken = token;
    user.resetPasswordTokenExpiry = new Date(Date.now() + 1000 * 60 * 15); 
    await user.save();

    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.WEBSITE_EMAIL,
            pass: process.env.WEBSITE_EMAIL_PASSWORD,
        }
    });

    const mailOptions = {
        from: process.env.WEBSITE_EMAIL,
        to: email,
        subject: "Getlancer - Reset Password",
        html: `<p>Click below to reset password:</p>
           <a href="${resetLink}">${resetLink}</a>`,
    };

    const result = await transporter.sendMail(mailOptions);

    return Response.json({ message: "Email sent", result });
}