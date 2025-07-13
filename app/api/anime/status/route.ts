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

  const { animeId, action } = await req.json();

  if (!animeId || !action) {
    return NextResponse.json({ message: 'Missing data' }, { status: 400 });
  }

  await dbConnect();

  const updateField = `animeStatus.${action}`;
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      decoded.userId,
      { $addToSet: { [updateField]: animeId } },
      { new: true }
    );

    if (!updatedClient) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Anime updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}