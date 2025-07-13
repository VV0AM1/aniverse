import dbConnect from '@/app/lib/mongodb';
import Client from '@/app/models/Client';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return new Response('Missing ID', { status: 400 });

  await dbConnect();

  const user = await Client.findById(id).select('nickname avatar _id').lean();
  if (!user) return new Response('User not found', { status: 404 });

  return new Response(JSON.stringify(user), { status: 200 });
}