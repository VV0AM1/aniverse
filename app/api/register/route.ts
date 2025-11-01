export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dbConnect from '@/app/lib/mongodb';
import Client from '@/app/models/Client';
import { handleCors } from '@/app/lib/cors';

export async function POST(req: NextRequest) {
  try {
    const corsRes = handleCors(req);
    if (corsRes) return corsRes;

    const { nickname, email, password } = await req.json();
    console.log("🔐 Register attempt:", { nickname, email });

    if (!nickname || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }
    if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      return NextResponse.json({
        message: 'Password must be at least 8 characters long and include an uppercase letter and a number',
      }, { status: 400 });
    }

    console.log("🔌 Connecting to DB...");
    await dbConnect();
    console.log("✅ DB connected.");

    const existing = await Client.findOne({ email });
    if (existing) {
      console.warn("⚠️ Email already exists");
      return NextResponse.json({ message: 'Email already registered' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newClient = new Client({
      nickname,
      email,
      password: hashedPassword,
      isVerified: false, 
    });

    await newClient.save();
    console.log("✅ User saved to DB.");

    const token = jwt.sign(
      { userId: newClient._id },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    const origin =
      process.env.PUBLIC_BASE_URL ||
      req.headers.get('origin') ||
      process.env.NEXTAUTH_URL ||
      'http://localhost:3000';

    const verifyUrl = `${origin}/api/verifyEmailConfirm?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });

    try {
      console.log("📧 Sending verification email to", email);
      const info = await transporter.sendMail({
        from: `"Aniverse" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify your Aniverse account',
        html: `
          <div style="font-family:Arial,sans-serif">
            <h2>Welcome, ${nickname}!</h2>
            <p>Please confirm your email to activate your account:</p>
            <p><a href="${verifyUrl}" target="_blank">${verifyUrl}</a></p>
            <p><small>This link expires in 1 hour.</small></p>
          </div>
        `,
      });
      console.log("✅ Verification email sent:", info.response);
    } catch (emailErr) {
      console.error("❌ Failed to send verification email:", emailErr);
      return NextResponse.json(
        {
          message: 'Registration successful, but failed to send verification email. Please try again later.',
          user: { _id: newClient._id, nickname: newClient.nickname, email: newClient.email },
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        message: 'Registration successful. Verification email sent.',
        user: { _id: newClient._id, nickname: newClient.nickname, email: newClient.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Register API Error:", error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}