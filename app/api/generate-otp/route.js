import { NextApiRequest, NextApiResponse } from 'next';
import Redis from 'ioredis';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Initialize Redis
//const redis = new Redis(process.env.REDIS_URL!);

// Configure Nodemailer for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your preferred email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ message: 'Email is required' });
//   }

//   try {
//     // Generate a 6-digit OTP
//     const otp = crypto.randomInt(100000, 999999).toString();

//     // Store OTP in Redis for 5 minutes
//     await redis.setex(email, 300, otp);

//     // Send OTP to user's email
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Your OTP Code',
//       text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
//     });

//     return res.status(200).json({ message: 'OTP sent to email' });
//   } catch (error) {
//     console.error('Error generating OTP:', error);
//     return res.status(500).json({ message: 'Error generating OTP' });
//   }
// }