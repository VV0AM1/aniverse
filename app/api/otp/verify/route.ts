export const runtime = "nodejs";

import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Client, { type IClient } from "@/app/models/Client";

export async function POST(req: NextRequest) {
  const { email, otp } = await req.json();
  await dbConnect();

  const user = await Client.findOne({ email });
  if (
    !user ||
    typeof user.otp !== "string" ||
    user.otp !== otp ||
    user.otpExpiry == null ||                       
    Date.now() > Number(user.otpExpiry)
  ) {
    return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
  }

  user.otp = null;
  user.otpExpiry = null;
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