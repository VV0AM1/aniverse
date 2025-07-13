import dbConnect from '@/app/lib/mongodb';
import Client from '@/app/models/Client';
import { pusher } from '@/app/lib/pusher';

export async function POST(req: Request) {
  const { senderId, receiverId } = await req.json();
  await dbConnect();

  const sender = await Client.findById(senderId);
  const receiver = await Client.findById(receiverId);

  if (!sender || !receiver) {
    return new Response('User not found', { status: 404 });
  }

  await pusher.trigger(`user-${receiverId}`, 'friend-request', {
    senderId,
    senderNickname: sender.nickname,
  });

  return new Response('Friend request sent', { status: 200 });
}