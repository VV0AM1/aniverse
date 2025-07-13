import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/app/lib/mongodb';
import Client from '@/app/models/Client';
import { handleCors } from '@/app/lib/cors';

export async function POST(req: NextRequest) {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  const { nickname, email, password, token: captchaToken } = await req.json();

  // 🧠 CAPTCHA CHECK
  if (!captchaToken) {
    return NextResponse.json({ message: 'Captcha missing' }, { status: 400 });
  }

  const res = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET}&response=${captchaToken}`,
  });
  const data = await res.json();

  if (!data.success) {
    return NextResponse.json({ message: 'reCAPTCHA failed' }, { status: 400 });
  }

  // 🧠 PASSWORD VALIDATION
  if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return NextResponse.json({
      message:
        'Password must be at least 8 characters long and include an uppercase letter and a number',
    }, { status: 400 });
  }

  await dbConnect();

  const existing = await Client.findOne({ email });
  if (existing) {
    return NextResponse.json({ message: 'Email already registered' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newClient = new Client({ nickname, email, password: hashedPassword });

  try {
    await newClient.save();
  } catch (error) {
    return NextResponse.json({ message: 'Error saving user to the database' }, { status: 500 });
  }

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
}