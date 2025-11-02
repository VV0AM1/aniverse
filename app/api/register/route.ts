export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import dbConnect from "@/app/lib/mongodb";
import Client, { type IClient } from "@/app/models/Client";
import PendingVerification from "@/app/models/PendingVerification";
import { sendVerificationEmail } from "@/app/lib/mailer";
import { renderVerificationEmail } from "@/app/lib/emailTemplates";

export async function POST(req: NextRequest) {
  try {
    const { nickname, email, password } = await req.json();

    if (!nickname || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      return NextResponse.json({
        message:
          "Password must be at least 8 characters long and include an uppercase letter and a number",
      }, { status: 400 });
    }

    await dbConnect();

    const existingUser = await Client.findOne({ email })
      .select("_id isVerified")
      .lean<IClient | null>();

    if (existingUser?.isVerified) {
      return NextResponse.json({ message: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const rawToken = crypto.randomBytes(32).toString("base64url");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await PendingVerification.findOneAndUpdate(
      { email },
      { email, nickname, passwordHash, tokenHash, expiresAt, createdAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const origin =
      process.env.PUBLIC_BASE_URL ||
      req.headers.get("origin") ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000";

    const verifyUrl = `${origin}/api/verifyEmailConfirm?token=${rawToken}&email=${encodeURIComponent(email)}`;

    await sendVerificationEmail({
      to: email,
      subject: "Verify your Aniverse account",
      html: renderVerificationEmail({ nickname, verifyUrl }), 
    });

    return NextResponse.json({ message: "Check your email to verify your account." }, { status: 200 });
  } catch (err: any) {
    if (err?.code === 11000) {
      return NextResponse.json({ message: "Check your email to verify your account." }, { status: 200 });
    }
    console.error("❌ Register (pending) error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}