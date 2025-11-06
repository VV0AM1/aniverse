'use client';

import { useState, useEffect, useRef } from 'react';
import NavBar from '@/app/lib/components/NavBar';
import { animeServices } from "@/app/lib/services/animes";
import DashboardSkeleton from '../lib/components/Dashboardskeleton';
import { useAuth } from '@/app/context/AuthContext';
import { useSession } from 'next-auth/react';        
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AnimeCounts {
  liked: number;
  watched: number;
  bookmark: number;
  later: number;
}

export default function UserProfile() {
  const { nickname, token, setNickname } = useAuth();
  const { data: session, status } = useSession();      
  const sessionLoading = status === 'loading';

  const [authReady, setAuthReady] = useState(false);
  const [avatar, setAvatar] = useState('/img/defaultuser.png');
  const [bio, setBio] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<'liked' | 'watched' | 'bookmark' | 'later'>('liked');
  const [animeCounts, setAnimeCounts] = useState<AnimeCounts>({ liked: 0, watched: 0, bookmark: 0, later: 0 });
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [isLoadingAnimes, setIsLoadingAnimes] = useState(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  
  useEffect(() => {
    if (sessionLoading) return; 
    const hasLocal = !!nickname && !!token;
    const hasNextAuth = !!session;

    if (!hasLocal && !hasNextAuth) {
      router.replace('/Login'); 
      return;
    }
    setAuthReady(true);
  }, [nickname, token, session, sessionLoading, router]);

  useEffect(() => {
    if (!authReady || !nickname || !token) return;
    setNewNickname(nickname);
    fetchCounts(nickname, token);
    fetchUserProfile(nickname, token);
  }, [authReady, nickname, token]);

  useEffect(() => {
    if (!authReady || !nickname || !token) return;

    const fetchUserAnimeByCategory = async () => {
      setIsLoadingAnimes(true);

      const res = await fetch('/api/getUserAnimeIds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}), 
        },
        body: JSON.stringify({ nickname, category: selectedCategory }),
      });

      const data = await res.json();
      if (!res.ok) {
        setIsLoadingAnimes(false);
        return;
      }

      const ids = data.animeIds || [];

      if (ids.length === 0) {
        setAnimeList([]);
        setIsLoadingAnimes(false);
        return;
      }


      const animeDataList:any[] = [];

      for (const id of ids) {
        try {
          const res = await animeServices.getByIdFull(String(id));
          animeDataList.push({
            id: res.data.data.mal_id,
            title: res.data.data.title,
            image: res.data.data.images.jpg.image_url,
          });
        } catch (err) {
          console.error(`Failed to fetch anime ${id}`, err);
        }
        await new Promise((r) => setTimeout(r, 1200));
      }

      setAnimeList(animeDataList);
      setIsLoadingAnimes(false);
    };

    fetchUserAnimeByCategory();
  }, [selectedCategory, authReady, nickname, token]);

  const fetchCounts = async (nickname: string, token: string) => {
    const res = await fetch('/api/getUserAnimeCounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ nickname }),
    });
    const data = await res.json();
    if (res.ok) setAnimeCounts(data.counts);
  };

  const fetchUserProfile = async (nickname: string, token: string) => {
    const res = await fetch('/api/getUserProfile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ nickname }),
    });
    const data = await res.json();
    if (res.ok) {
      setAvatar(data.avatar || '/img/defaultuser.png');
      setBio(data.bio || '');
      setDob(data.dob || '');
      setGender(data.gender || '');
    }
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setAvatar(base64);

      await fetch('/api/uploadAvatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nickname, avatarBase64: base64 }),
      });
    };

    reader.readAsDataURL(file);
  };

  const updateNickname = async () => {
    if (!token) return;

    const res = await fetch('/api/updateNickname', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldNickname: nickname, newNickname }),
    });

    const data = await res.json();
    if (res.ok) {
      setNickname(newNickname);
      setIsEditingNickname(false);
    } else {
      alert(`Nickname update failed: ${data.message}`);
    }
  };

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  if (!authReady) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d1a] to-[#1a1a2e] text-white">
      <NavBar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 pt-[120px]">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div
            className="relative group w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-purple-600 shadow-lg hover:scale-105 transition-transform cursor-pointer"
            onClick={handleUploadClick}
          >
            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} hidden />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm">
              Change
            </div>
          </div>

          <div className="flex-1 w-full space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <input
                type="text"
                value={(isEditingNickname ? newNickname : nickname) || ""}
                onChange={(e) => setNewNickname(e.target.value)}
                disabled={!isEditingNickname}
                className="bg-transparent text-2xl sm:text-3xl font-bold border-b border-purple-500 focus:outline-none"
              />
              <button
                onClick={() => (isEditingNickname ? updateNickname() : setIsEditingNickname(true))}
                className="px-4 py-1 bg-purple-600 rounded hover:bg-purple-700 text-sm"
              >
                {isEditingNickname ? "Save" : "Edit"}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="bg-[#1f1f2e] text-white border-b border-gray-500 focus:border-purple-500 outline-none px-2 py-1 rounded"
              />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="bg-[#1f1f2e] text-white border-b border-gray-500 focus:border-purple-500 outline-none px-2 py-1 rounded"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="w-full h-28 bg-[#2e2e3a] p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-600 resize-none"
            />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {(['liked', 'watched', 'bookmark', 'later'] as const).map((key) => (
            <div
              key={key}
              className="bg-purple-900 bg-opacity-40 rounded-xl p-4 hover:bg-purple-800 shadow-md transition"
            >
              <p className="text-base sm:text-lg font-semibold capitalize">{key}</p>
              <p className="text-xl sm:text-3xl font-bold">{animeCounts[key]}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3 justify-center sm:justify-start">
          {(['liked', 'watched', 'bookmark', 'later'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                selectedCategory === cat ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {capitalize(cat)}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {isLoadingAnimes ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6">
              {Array.from({ length: 10 }).map((_, i) => <DashboardSkeleton key={i} />)}
            </div>
          ) : animeList.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center bg-[#151527] border border-[#23252b] rounded-2xl p-8">
              <img src="/img/face.png" alt="" className="w-16 h-16 opacity-80 mb-3" />
              <h3 className="text-lg font-semibold mb-1">No anime here yet</h3>
              <p className="text-sm text-gray-300">
                You don’t have any anime in the <span className="font-semibold">{capitalize(selectedCategory)}</span> list.
              </p>
              <div className="mt-4 flex gap-2">
                <Link href="/Trending" className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-sm">
                  Explore Trending
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6">
              {animeList.slice(0, 30).map((anime) => (
                <div
                  key={anime.id}
                  className="relative cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => (window.location.href = `/animes/${anime.id}`)}
                >
                  <img
                    src={anime.image}
                    alt={anime.title}
                    className="w-full h-[240px] sm:h-[280px] object-cover rounded-lg shadow"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs sm:text-sm p-2 truncate">
                    {anime.title}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}