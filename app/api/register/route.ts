import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/app/lib/mongodb';
import Client from '@/app/models/Client';
import { handleCors } from '@/app/lib/cors';

export async function POST(req: NextRequest) {
  try {
    const corsRes = handleCors(req);
    if (corsRes) return corsRes;

    const body = await req.json();
    const { nickname, email, password } = body;

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
    const newClient = new Client({ nickname, email, password: hashedPassword });

    await newClient.save();
    console.log("✅ User saved to DB.");

    const token = jwt.sign(
      { userId: newClient._id, email: newClient.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return NextResponse.json(
      {
        message: 'Registration successful',
        token,
        user: {
          _id: newClient._id,
          nickname: newClient.nickname,
          email: newClient.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Register API Error:", error);
    return NextResponse.json({ message: 'Server error', error }, { status: 500 });
  }
}