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
    const { oldNickname, newNickname } = await req.json();

    if (!oldNickname || !newNickname) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    const user = await Client.findById(decoded.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (user.nickname !== oldNickname) {
      return NextResponse.json({ error: 'Old nickname does not match' }, { status: 403 });
    }

    const exists = await Client.findOne({ nickname: newNickname });
    if (exists) {
      return NextResponse.json({ error: 'Nickname already taken' }, { status: 409 });
    }

    user.nickname = newNickname;
    await user.save();

    return NextResponse.json({ message: 'Nickname updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}