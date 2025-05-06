import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/app/lib/mongodb';
import Client from '@/app/models/Client';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  await dbConnect();

  const user = await Client.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
  }

  return NextResponse.json({ message: 'Login successful', user: { nickname: user.nickname, email: user.email } });
}