import crypto from "crypto";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Client from "@/app/models/Client";
import { sendOtpEmail } from "@/app/lib/mailer";
import { renderOtpEmail } from "@/app/lib/emailTemplates";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  await dbConnect();

  const user = await Client.findOne({ email });
  if (!user) return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });

  const otp = crypto.randomInt(100000, 999999).toString();
  user.otp = otp;
  user.otpExpiry = Date.now() + 5 * 60 * 1000;
  await user.save();

  await sendOtpEmail({
    to: user.email,
    subject: "Your Aniverse OTP code",
    html: renderOtpEmail({ otp }),
  });

  return NextResponse.json({ message: "OTP sent to your email" }, { status: 200 });
}