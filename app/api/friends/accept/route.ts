import dbConnect from '@/app/lib/mongodb';
import Client from '@/app/models/Client';

export async function POST(req: Request) {
  const { senderId, receiverId } = await req.json();
  await dbConnect();

  const sender = await Client.findById(senderId);
  const receiver = await Client.findById(receiverId);

  if (!sender || !receiver) {
    return new Response('User not found', { status: 404 });
  }

  sender.friends.push(receiver._id);
  receiver.friends.push(sender._id);

  await sender.save();
  await receiver.save();

  return new Response('Friend request accepted', { status: 200 });
}