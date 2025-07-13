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
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { avatarBase64 } = await req.json();

    if (!avatarBase64) {
      return NextResponse.json({ error: 'Missing avatar data' }, { status: 400 });
    }

    await dbConnect();

    const updated = await Client.findByIdAndUpdate(
      decoded.userId,
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