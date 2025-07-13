import dbConnect from '@/app/lib/mongodb';
import Client from "@/app/models/Client";
import { pusher } from "@/app/lib/pusher";

export async function POST(req: Request) {
  const { senderId, receiverNickname } = await req.json();
  await dbConnect();

  const receiver = await Client.findOne({ nickname: receiverNickname });
  if (!receiver) return new Response("User not found", { status: 404 });

  await pusher.trigger(`user-${receiver._id}`, "friend-request", {
    senderId,
  });

  return new Response("Request sent", { status: 200 });
}