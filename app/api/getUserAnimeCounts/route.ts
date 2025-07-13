import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Client from '@/app/models/Client';
import { handleCors } from '@/app/lib/cors';
import { verifyToken } from '@/app/lib/verifyToken';

export async function POST(req: NextRequest) {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  const auth = req.headers.get('authorization');
  const decoded = verifyToken(auth);
  if (!decoded) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  await dbConnect();

  try {
    const client = await Client.findById(decoded.userId);
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