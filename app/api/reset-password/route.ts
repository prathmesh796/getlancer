import { connect } from "@/utils/db";
import User from "@/models/User";
import bcryptjs from "bcryptjs";

export async function POST(req: Request) {
  const { token, password } = await req.json();
  console.log("Received token:", token); // Log the received token for debugging
  console.log("Received password:", password); // Log the received password for debugging

  await connect();

  const user = await User.findOne({
    resetPasswordToken: token,
  });

  if (
    !user ||
    !user.resetPasswordTokenExpiry ||
    user.resetPasswordTokenExpiry.getTime() < Date.now()
  ) {
    return Response.json({ message: "Invalid or expired token" }, { status: 400 });
  }

  const salt = await bcryptjs.genSalt(10)
  const hashedPassword = await bcryptjs.hash(password, salt)

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpiry = undefined;

  await user.save();

  return Response.json({ message: "Password updated successfully" });
}