import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Client from '@/app/models/Client';

export async function POST(req: NextRequest) {
  const { nickname } = await req.json();

  if (!nickname) {
    return NextResponse.json({ message: 'Missing nickname' }, { status: 400 });
  }

  await dbConnect();

  try {
    const client = await Client.findOne({ nickname });

    if (!client) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const counts = {
      liked: client.animeStatus.liked.length,
      watched: client.animeStatus.watched.length,
      bookmark: client.animeStatus.bookmark.length,
      later: client.animeStatus.later.length,
    };

    return NextResponse.json({ counts });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}