import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Client from "@/app/models/Client";

export async function POST(req: NextRequest) {
  const { email, otp } = await req.json();
  await dbConnect();

  const user = await Client.findOne({ email });
  if (!user || user.otp !== otp || Date.now() > user.otpExpiry) {
    return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
  }

  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  return NextResponse.json(
    {
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        nickname: user.nickname,
        email: user.email,
      },
    },
    { status: 200 }
  );
}