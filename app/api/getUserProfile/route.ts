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

  await dbConnect();

  try {
    const user = await Client.findById(decoded.userId);
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
