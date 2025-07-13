'use client';

import { useEffect, useState } from 'react';
import { pusherClient } from '@/app/lib/pusherClient';

export default function ChatWindow({
  userId,
  selectedFriend,
  onNewChat,
}: {
  userId: string;
  selectedFriend: any;
  onNewChat: (sender: any) => void;
}) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
    const channel = pusherClient.subscribe(`chat-${userId}`);

    channel.bind('new-message', (data: any) => {
        if (data.senderId === selectedFriend._id) {
        setMessages((prev) => [...prev, data]);
        }
    });

    return () => {
        channel.unbind_all();
        channel.unsubscribe();
    };
    }, [userId, selectedFriend]);

  const sendMessage = async () => {
    const message = {
      senderId: userId,
      receiverId: selectedFriend._id,
      content: newMessage,
    };

    await fetch('/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    setMessages((prev) => [...prev, { ...message, timestamp: new Date() }]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-white flex items-center gap-2">
        <img src={selectedFriend.avatar || '/img/default.png'} className="w-10 h-10 rounded-full" />
        <span className="font-semibold">{selectedFriend.nickname}</span>
      </div>
      <div className="flex-1 p-4 space-y-2 overflow-y-auto bg-black text-white">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[70%] px-4 py-2 rounded-lg ${
              msg.senderId === userId ? 'bg-blue-200 ml-auto text-black' : 'bg-gray-700'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="p-4 border-t bg-white flex gap-2"
      >
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Send
        </button>
      </form>
    </div>
  );
}