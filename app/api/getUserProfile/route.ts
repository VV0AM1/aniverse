import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Client from '@/app/models/Client';

export async function POST(req: NextRequest) {
  try {
    const { nickname } = await req.json();

    if (!nickname) {
      return NextResponse.json({ error: 'Missing nickname' }, { status: 400 });
    }

    await dbConnect();

    const user = await Client.findOne({ nickname });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      avatar: user.avatar || null,
      bio: user.bio || '',
      dob: user.dob || '',
      gender: user.gender || '',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}