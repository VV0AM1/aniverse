'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { SendHorizonal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import "@/app/globals.css";

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AnimeAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! 👋 I’m Aiko, your anime guide! Want a recommendation?' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let showTimeout: NodeJS.Timeout;
    let loopInterval: NodeJS.Timeout;

    const startLoop = () => {
      setShowWelcome(true);
      showTimeout = setTimeout(() => setShowWelcome(false), 10000);
    };

    const startInterval = () => {
      loopInterval = setInterval(() => startLoop(), 60000);
    };

    const initial = setTimeout(() => {
      startLoop();
      startInterval();
    }, 4000);

    return () => {
      clearTimeout(initial);
      clearTimeout(showTimeout);
      clearInterval(loopInterval);
    };
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
        { role: 'assistant', content: "Sorry, I couldn’t help with that 😢." },
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
      <div className="fixed bottom-6 right-6 z-40">
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen((prev) => !prev)}
            className="w-16 h-16 rounded-full border-2 border-purple-500 overflow-hidden shadow-[0_4px_20px_rgba(128,0,255,0.3)] bg-white transition-all duration-300"
          >
            <Image
              src="/img/aiko.webp"
              alt="Aiko"
              width={64}
              height={64}
              className="object-cover"
            />
          </motion.button>

          {showWelcome && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute w-[220px] bottom-[80px] right-0 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse text-sm"
            >
              Hi! I’m <b>Aiko</b>, need anime help?
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', stiffness: 180, damping: 20 }}
            className="fixed bottom-[100px] right-6 z-50 w-[90%] sm:w-[380px] bg-[#1b1b2f] text-white rounded-2xl shadow-[0_0_25px_rgba(128,0,255,0.4)] flex flex-col overflow-hidden"
            style={{ maxHeight: '80dvh' }}
          >
            <div className="bg-gradient-to-r from-purple-700 to-purple-500 px-4 py-3 font-semibold text-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Image
                  src="/img/aiko.webp"
                  alt="Aiko"
                  width={32}
                  height={32}
                  className="rounded-full border border-white/20"
                />
                Aiko 
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-purple-600/40 rounded-full transition"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div
              ref={chatRef}
              className="p-4 text-sm space-y-3 flex-1 overflow-y-auto bg-[#13132a] custom-scroll"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`rounded-2xl px-4 py-2 max-w-[85%] break-words ${
                    msg.role === 'assistant'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white self-start shadow-md'
                      : 'bg-gray-700 text-white self-end ml-auto shadow'
                  }`}
                >
                  {msg.content}
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-3 py-2 bg-purple-500/80 rounded-xl w-fit animate-pulse"
                >
                  Aiko is typing...
                </motion.div>
              )}
            </div>

            <div className="flex items-center gap-2 border-t border-purple-600/40 px-3 py-3 bg-[#1b1b2f]">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Aiko about anime..."
                className="flex-1 px-4 py-2 rounded-full bg-[#2a2a40] text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                className="p-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition"
              >
                <SendHorizonal size={20} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}