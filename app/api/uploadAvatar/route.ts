import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Client from '@/app/models/Client';

export async function POST(req: NextRequest) {
  try {
    const { nickname, avatarBase64 } = await req.json();

    if (!nickname || !avatarBase64) {
      return NextResponse.json({ error: 'Missing nickname or avatar' }, { status: 400 });
    }

    await dbConnect();

    const updated = await Client.findOneAndUpdate(
      { nickname },
      { avatar: avatarBase64 },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Avatar updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}