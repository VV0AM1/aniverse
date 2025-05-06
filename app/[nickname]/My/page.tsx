'use client';

import { useState, useEffect } from 'react';
import NavBar from '@/app/lib/components/NavBar';
import { useRef } from 'react'; 

interface AnimeCounts {
  liked: number;
  watched: number;
  bookmark: number;
  later: number;
}

export default function UserProfile() {
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('/img/default-avatar.png');
  const [bio, setBio] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'liked' | 'watched' | 'bookmark' | 'later'>('liked');
  const [animeCounts, setAnimeCounts] = useState<AnimeCounts>({
    liked: 0,
    watched: 0,
    bookmark: 0,
    later: 0,
  });
  const [animeList, setAnimeList] = useState<any[]>([]);

  useEffect(() => {
    const storedNickname = localStorage.getItem('nickname');
    if (storedNickname) {
      setNickname(storedNickname);
      fetchCounts(storedNickname);
      fetchUserProfile(storedNickname);
    }
  }, []);

  const fetchCounts = async (nickname: string) => {
    try {
      const res = await fetch('/api/getUserAnimeCounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname }),
      });
      const data = await res.json();
      if (res.ok) setAnimeCounts(data.counts);
    } catch (err) {
      console.error('Failed to fetch counts', err);
    }
  };

  const fetchUserProfile = async (nickname: string) => {
    try {
      const res = await fetch('/api/getUserProfile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        if (data.avatar) setAvatar(data.avatar);
        if (data.bio) setBio(data.bio);
        if (data.dob) setDob(data.dob);
        if (data.gender) setGender(data.gender);
      }
    } catch (err) {
      console.error('Failed to fetch user profile', err);
    }
  };


  useEffect(() => {
    if (!nickname) return;

    // Example fetch logic - replace with actual anime fetch logic
    // setAnimeList(fetchedAnimeList);
    setAnimeList([
      { id: 1, title: 'Example Anime', image: '/img/anime-sample.jpg' },
      { id: 2, title: 'Another Anime', image: '/img/anime-sample.jpg' },
    ]);
  }, [selectedCategory, nickname]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

  const reader = new FileReader();
  reader.onload = async () => {
    const base64 = reader.result as string;
    setAvatar(base64); // Show preview immediately

    try {
      const nickname = localStorage.getItem('nickname');
      const res = await fetch('/api/uploadAvatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, avatarBase64: base64 }),
      });

      if (!res.ok) throw new Error('Upload failed');
      console.log('Avatar updated!');
    } catch (err) {
      console.error('Error uploading avatar:', err);
    }
  };

  reader.readAsDataURL(file);
};

  return (
    <div>
    <div className='w-full h-24'><NavBar />
    </div>
    <div className="user-profile-container p-6 text-white max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <div className="relative group w-40 h-40 rounded-full overflow-hidden border-4 border-gray-700 cursor-pointer" onClick={handleUploadClick}>
            <img src={avatar} alt="Avatar" className="object-cover w-full h-full" />
  
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                style={{ display: 'none' }} // Hide the input
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm">
                Upload
            </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="text-3xl font-bold bg-transparent border-b border-gray-600 outline-none w-full"
          />
          <div className="mt-2 flex gap-4">
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="bg-transparent border-b border-gray-600 outline-none"
            />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="bg-transparent border-b border-gray-600 outline-none"
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <textarea
            placeholder="Write your bio here..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full mt-4 bg-transparent border border-gray-600 p-2 rounded-md"
          />
        </div>
      </div>

      {/* Anime Counters */}
      <div className="mt-6 flex gap-6 text-center">
        {(['liked', 'watched', 'bookmark', 'later'] as const).map((key) => (
          <div key={key} className="flex-1 p-4 bg-purple-900 rounded-lg">
            <p className="text-lg font-semibold capitalize">{key}</p>
            <p className="text-2xl">{animeCounts[key]}</p>
          </div>
        ))}
      </div>

      {/* Category Selector */}
      <div className="mt-8">
        <div className="flex gap-4 mb-4">
          {(['liked', 'watched', 'bookmark', 'later'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-md transition ${
                selectedCategory === cat ? 'bg-purple-700' : 'bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Anime List */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {animeList.map((anime) => (
            <div key={anime.id} className="bg-gray-800 rounded-lg overflow-hidden">
              <img src={anime.image} alt={anime.title} className="w-full h-40 object-cover" />
              <p className="text-center py-2">{anime.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>

  );
}