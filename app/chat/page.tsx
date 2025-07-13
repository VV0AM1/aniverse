'use client';

import { useEffect, useState } from 'react';
import ChatWindow from '@/app/lib/components/ChatWindow';
import SearchBar from '@/app/lib/components/SearchBar';
import { pusherClient } from '@/app/lib/pusherClient';

export default function Page() {
  const [userId, setUserId] = useState('');
  const [chats, setChats] = useState<any[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<any>(null);

  useEffect(() => {
    const uid = localStorage.getItem('userId');
    if (uid) setUserId(uid);
  }, []);

    useEffect(() => {
    if (!userId) return;

    const channel = pusherClient.subscribe(`chat-${userId}`);

    const handleMessage = async (data: any) => {
        // Prevent duplicate
        const exists = chats.some(chat => chat._id === data.senderId);
        if (exists) return;

        try {
        const res = await fetch(`/api/users/profile?id=${data.senderId}`);
        const sender = await res.json();

        setChats(prev => {
            const already = prev.some(c => c._id === sender._id);
            return already ? prev : [...prev, sender];
        });
        } catch (err) {
        console.error('Failed to fetch sender profile', err);
        }
    };

    channel.bind('new-message', handleMessage);

    return () => {
        channel.unbind('new-message', handleMessage);
        channel.unsubscribe();
    };
}, [userId, chats]);

  const handleNewChat = async (senderId: string) => {
    const exists = chats.some((chat) => chat._id === senderId);
    if (!exists) {
      const res = await fetch(`/api/users/profile?id=${senderId}`);
      const user = await res.json();
      setChats((prev) => [...prev, user]);
    }
  };

  const handleSelect = (friend: any) => {
    const exists = chats.some((chat) => chat._id === friend._id);
    if (!exists) {
      setChats((prev) => [...prev, friend]);
    }
    setSelectedFriend(friend);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 bg-black text-white p-4">
        <SearchBar onUserSelect={handleSelect} />
        <ul className="mt-4 space-y-2">
          {chats.map((chat) => (
            <li
              key={chat._id}
              onClick={() => setSelectedFriend(chat)}
              className={`cursor-pointer p-2 rounded hover:bg-gray-800 ${
                selectedFriend?._id === chat._id ? 'bg-gray-800' : ''
              }`}
            >
              {chat.nickname}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 bg-gray-900">
        {selectedFriend ? (
          <ChatWindow
            userId={userId}
            selectedFriend={selectedFriend}
            onNewChat={handleNewChat}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-white">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}