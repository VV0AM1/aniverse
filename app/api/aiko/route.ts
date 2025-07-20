import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body?.message;

    if (!message || typeof message !== 'string') {
      console.error('❌ Invalid or missing message:', message);
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    console.log('🟢 Asking DeepSeek:', message);

    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are Aiko, a friendly anime assistant. Only answer questions about anime recommendations.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const reply = completion.choices?.[0]?.message?.content?.trim();

    console.log('🟣 Aiko replies:', reply);

    return NextResponse.json({ reply: reply || "Sorry, I couldn’t help with that." });
  } catch (err) {
    console.error('❌ DeepSeek API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}