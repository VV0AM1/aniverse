"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { animeServices } from "@/app/lib/services/animes";
import Image from "next/image";
import Character from "./Character";
import Review, { ReviewHandle } from "./Review";

import Socials from "./Socials";
import AnimeRecomendation from "./AnimeRecomendations";
import Footer from "./Footer";

export default function Anime() {
  const { mal_id } = useParams();
  const [animeData, setAnimeData] = useState<any>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  if (!mal_id || Array.isArray(mal_id)) {
    return <div>Invalid anime ID</div>;
  }

  const reviewRef = useRef<ReviewHandle>(null);

  const animeId = String(mal_id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const animeRes = await animeServices.getByIdFull(animeId);
        setAnimeData(animeRes.data.data);
      } catch (error) {
        console.error("Error fetching anime details:", error);
      }
    };

    fetchData();
  }, [animeId]);

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    const storedToken = localStorage.getItem("token");
    if (storedNickname) setNickname(storedNickname);
    if (storedToken) setToken(storedToken);
  }, []);

  const handleAnimeAction = async (actionType: string) => {
    if (!nickname || !token) {
      alert("You're not logged in!");
      return;
    }

    try {
      const res = await fetch("/api/anime/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nickname,
          animeId,
          action: actionType,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to update");

      alert(`Successfully updated: ${actionType}`);
    } catch (error: any) {
      console.error("Error updating anime status:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  if (!animeData) return <div className="text-white text-center">Loading...</div>;

  return (
    <div className="w-full text-white pt-[100px]">
      <div
        className="relative w-full py-12 px-4 bg-cover bg-center"
        style={{
          backgroundImage: "url('/img/back-amime.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row gap-6 px-4 md:px-8">
          {/* Anime Cover Image */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <Image
              src={animeData?.images?.jpg?.image_url}
              width={180}
              height={260}
              alt={animeData.title}
              className="rounded-lg object-cover w-[180px] h-[260px]"
            />
          </div>

          {/* Anime Info */}
          <div className="flex flex-col gap-3 text-white max-w-4xl">
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-purple-300">{animeData.title}</h1>

            {/* Stats */}
            <div className="flex gap-2 flex-wrap text-xs sm:text-sm">
              <span className="bg-gray-800 px-2 py-1 rounded-md flex items-center gap-1">⭐ {animeData.score}</span>
              <span className="bg-gray-800 px-2 py-1 rounded-md">{animeData.duration || `${animeData.volumes} per chapter`}</span>
              <span className="bg-gray-800 px-2 py-1 rounded-md">
                {animeData.episodes ? `${animeData.episodes} Episodes` : `${animeData.chapters} Chapters`}
              </span>
              <span className="bg-gray-800 px-2 py-1 rounded-md">{animeData.type}</span>
              <span className="bg-gray-800 px-2 py-1 rounded-md flex items-center gap-1">❤️ {animeData.members}</span>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-2 mt-2">
              {animeData.trailer?.url && (
                <a
                  href={animeData.trailer?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-white text-sm"
                >
                  ▶ Watch Trailer
                </a>
              )}

              {["bookmark", "later", "liked", "watched"].map((action) => (
                <button
                  key={action}
                  onClick={() => handleAnimeAction(action)}
                  className="bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-md text-sm"
                >
                  {action.charAt(0).toUpperCase() + action.slice(1)}
                </button>
              ))}
            </div>

            {/* Description */}
            <p className="text-gray-200 text-sm mt-2 line-clamp-5 md:line-clamp-none">
              {animeData.synopsis}
            </p>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mt-2">
              {animeData.genres?.map((genre: any) => (
                <span key={genre.mal_id} className="bg-[#1D0D39] text-xs px-2 py-1 rounded-md">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <h2 className="text-3xl font-semibold mb-4">Characters</h2>
        <Character mal_id={animeId} />
      </div>

      <div className="w-[90vw] mx-auto px-4 mt-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl md:text-3xl font-semibold">Reviews</h2>
          <div className="flex gap-2">
            <button
              onClick={() => reviewRef.current?.scrollLeft()}
              className="text-lg px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600"
            >
              {"<"}
            </button>
            <button
              onClick={() => reviewRef.current?.scrollRight()}
              className="text-lg px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600"
            >
              {">"}
            </button>
          </div>
        </div>

        {/* ✅ Fix this wrapper */}
        <div className="overflow-hidden w-full">
          <Review ref={reviewRef} mal_id={animeId} />
        </div>
      </div>

      {/* Recommendations */}
      <div className="max-w-7xl mx-auto px-4 mt-10">
        <h2 className="text-3xl font-semibold mb-4">People Also Liked</h2>
        <AnimeRecomendation mal_id={animeId} />
      </div>

      {/* Socials */}
      <div className=" mt-10">
        <Socials />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}