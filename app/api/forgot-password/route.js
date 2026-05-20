// import { connect } from "@/utils/db";
// import User from "@/models/User";
// import crypto from "crypto";
// import nodemailer from "nodemailer";

// export async function POST(req) {
//     const { email } = await req.json();

//     await connect();

//     const user = await User.findOne({ email });
//     if (!user) {
//         return Response.json({ message: "User not found" }, { status: 404 });
//     }

//     // Generate token
//     const token = crypto.randomBytes(32).toString("hex");

//     user.resetToken = token;
//     user.resetTokenExpiry = Date.now() + 1000 * 60 * 15; // 15 min
//     await user.save();

//     const resetLink = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;

//     // Send email
//     const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS,
//         },
//     });

//     await transporter.sendMail({
//         to: email,
//         subject: "Reset Password",
//         html: `<p>Click below to reset password:</p>
//            <a href="${resetLink}">${resetLink}</a>`,
//     });

//     return Response.json({ message: "Email sent" });
// }