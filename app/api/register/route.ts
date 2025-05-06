import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/app/lib/mongodb';
import Client from '@/app/models/Client';

export async function POST(req: Request) {
  const { nickname, email, password } = await req.json();

  await dbConnect();

  const existing = await Client.findOne({ email });
  if (existing) {
    return NextResponse.json({ message: 'Email already registered' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newClient = new Client({ nickname, email, password: hashedPassword });
  await newClient.save();

  return NextResponse.json({ message: 'Registration successful' }, { status: 201 });
}