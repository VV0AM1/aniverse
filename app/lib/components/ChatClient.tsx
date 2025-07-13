'use client';

import { useState, useEffect } from 'react';

interface ChatClientProps {
  userId: string;
  chats: {
    friendId: string;
    friendName: string;
    avatar: string;
  }[];
}

export default function ChatClient({ userId, chats }: ChatClientProps) {
  const [search, setSearch] = useState('');
  const [selectedChat, setSelectedChat] = useState<typeof chats[0] | null>(null);
  const [messages, setMessages] = useState<{ sender: string; content: string; timestamp: string }[]>([]);

  // Mock fetching messages for the selected chat
  useEffect(() => {
    if (!selectedChat) return;
    // Replace with fetch API call
    setMessages([
      { sender: userId, content: 'Hey there!', timestamp: '2023-01-01' },
      { sender: selectedChat.friendId, content: 'Hi!', timestamp: '2023-01-01' },
    ]);
  }, [selectedChat]);

  return (
    <div className="flex h-[90vh] border rounded-lg overflow-hidden shadow-md">
      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r flex flex-col">
        {/* Search Box */}
        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="Search by nickname..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats
            .filter((c) => c.friendName.toLowerCase().includes(search.toLowerCase()))
            .map((chat) => (
              <div
                key={chat.friendId}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 cursor-pointer hover:bg-gray-100 border-b ${
                  selectedChat?.friendId === chat.friendId ? 'bg-gray-100' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={chat.avatar} alt={chat.friendName} className="w-8 h-8 rounded-full" />
                  <span>{chat.friendName}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Top Bar */}
        <div className="p-4 border-b flex items-center gap-4 bg-white shadow-sm">
          {selectedChat ? (
            <>
              <img src={selectedChat.avatar} className="w-10 h-10 rounded-full" />
              <span className="text-lg font-semibold">{selectedChat.friendName}</span>
            </>
          ) : (
            <span className="text-gray-500">Select a conversation</span>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {selectedChat &&
            messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[70%] px-4 py-2 rounded-lg ${
                  msg.sender === userId ? 'bg-blue-100 ml-auto' : 'bg-gray-200'
                }`}
              >
                {msg.content}
              </div>
            ))}
        </div>

        {/* Message Input */}
        {selectedChat && (
          <div className="p-4 border-t bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // sendMessage()
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}