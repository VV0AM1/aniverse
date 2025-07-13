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
  if (!decoded) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await req.json();
    const { category } = body;

    if (!category || !['liked', 'watched', 'bookmark', 'later'].includes(category)) {
      return NextResponse.json({ message: 'Invalid category' }, { status: 400 });
    }

    const client = await Client.findById(decoded.userId);
    if (!client) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const animeIds = client.animeStatus?.[category] || [];
    console.log(`Anime IDs for category "${category}":`, animeIds);

    return NextResponse.json({ animeIds }, { status: 200 });
  } catch (error: any) {
    console.error("Error in /api/getUserAnimeIds:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}