import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import Client from '@/app/models/Client';

export async function POST(req: NextRequest) {
  const { nickname, animeId, action } = await req.json();

  // ✅ Checkpoint 1: log received data
  console.log('Received nickname:', nickname);
  console.log('Received animeId:', animeId);
  console.log('Action to perform:', action);

  if (!nickname || !animeId || !action) {
    console.warn('Missing data in request body');
    return NextResponse.json({ message: 'Missing data' }, { status: 400 });
  }

  await dbConnect();

  const updateField = `animeStatus.${action}`;
  console.log('Updating field:', updateField);

  try {
    const updatedClient = await Client.findOneAndUpdate(
      { nickname },
      { $addToSet: { [updateField]: animeId } },
      { new: true }
    );

    if (!updatedClient) {
      console.warn('User not found:', nickname);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    console.log('Update successful:', updatedClient);

    return NextResponse.json({ message: 'Anime updated successfully' });
  } catch (error: any) {
    console.error('Error updating anime status:', error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}