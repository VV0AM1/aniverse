import dbConnect from '@/app/lib/mongodb';
import Message from "@/app/models/Message";
import { pusher } from "@/app/lib/pusher";

export async function POST(req: Request) {
  const { senderId, receiverId, content } = await req.json();
  if (!senderId || !receiverId || !content) {
    return new Response('Missing fields', { status: 400 });
  }

  await dbConnect();

  const message = await Message.create({
    sender: senderId,
    receiver: receiverId,
    content,
  });

  await pusher.trigger(`chat-${receiverId}`, 'new-message', {
    senderId,
    content,
    timestamp: message.timestamp,
  });

  return new Response(JSON.stringify(message), { status: 200 });
}