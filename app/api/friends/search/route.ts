import dbConnect from '@/app/lib/mongodb';
import Client from '@/app/models/Client';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const nickname = searchParams.get('nickname') || '';
  await dbConnect();
  const users = await Client.find({ nickname: { $regex: nickname, $options: 'i' } });
  return new Response(JSON.stringify(users), { status: 200 });
}