'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { SendHorizonal } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AnimeAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! 👋 I’m Aiko, your anime guide! Want a recommendation?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/aiko', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply.replace(/\*\*/g, ''), 
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('AI Error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "Sorry, I couldn’t help with that." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="w-16 h-16 rounded-full border-2 border-purple-500 overflow-hidden shadow-xl hover:scale-105 transition-transform bg-white"
          >
            <Image
              src="/img/aiko.webp"
              alt="Aiko"
              width={64}
              height={64}
              className="object-cover"
            />
          </button>

          {showWelcome && !isOpen && (
            <div className="absolute w-[200px] bottom-20 right-0 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md animate-pulse max-w-[200px]">
              Hi! I’m <b>Aiko</b>, need anime help?
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-4  w-[90vw] max-w-md z-50 bg-[#1a1a2e] text-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
          <div className="bg-purple-700 px-4 py-3 font-bold text-lg">
            Aiko 👧 Anime Assistant
          </div>

          <div
            ref={chatRef}
            className="p-3 text-sm space-y-3 max-h-[500px] overflow-y-auto bg-[#121222]"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`rounded-lg px-4  py-2 max-w-[85%] whitespace-pre-wrap ${
                  msg.role === 'assistant'
                    ? 'bg-purple-600 text-white self-start'
                    : 'bg-gray-700 text-white self-end ml-auto'
                }`}
              >
                {msg.content}
              </div>
            ))}

            {isTyping && (
              <div className="px-3 py-2 bg-purple-500/80 rounded-md w-fit animate-pulse">
                Aiko is typing...
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-purple-500 px-3 py-2 bg-[#1a1a2e]">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask for anime recommendations..."
              className="flex-1 px-3 py-2 rounded bg-black/40 text-white text-sm focus:outline-none"
            />
            <button
              onClick={handleSend}
              className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition"
            >
              <SendHorizonal size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}