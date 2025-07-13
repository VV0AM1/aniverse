"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { animeServices } from "@/app/lib/services/animes";
import Image from "next/image";
import MangaChar from "./MangaChar";
import Review from "./Review";

export default function MangaDetailed() {
  const { mal_id } = useParams();
  const [mangaData, setMangaData] = useState<any>(null);
  const mangaID = String(mal_id);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mangaID) return;
    const fetchData = async () => {
      try {
        const mangaRes = await animeServices.getMangaById(mangaID);
        setMangaData(mangaRes.data.data);
      } catch (error) {
        console.error("Error fetching manga details:", error);
      }
    };
    fetchData();
  }, [mangaID]);

  if (!mangaData) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="w-full text-white mt-[100px]">
      {/* Top Section */}
      <div
        className="w-full bg-cover bg-center py-12 px-4 relative"
        style={{
          backgroundImage: "url('/img/back-amime.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />
        <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-6 z-10">
          {/* Manga image */}
          <div className="flex-shrink-0">
            <Image
              src={mangaData?.images?.jpg?.image_url}
              width={170}
              height={240}
              alt={mangaData.title}
              className="rounded-lg object-cover"
            />
          </div>

          {/* Text content */}
          <div className="flex flex-col gap-2 max-w-4xl">
            <h1 className="text-3xl font-bold text-purple-300">{mangaData.title}</h1>

            {/* Stats */}
            <div className="flex gap-2 flex-wrap text-sm">
              <span className="bg-gray-800 px-2 py-1 rounded-md flex items-center gap-1">
                ⭐ {mangaData.score}
              </span>
              <span className="bg-gray-800 px-2 py-1 rounded-md">
                {mangaData.duration || `${mangaData.volumes} per chapter`}
              </span>
              <span className="bg-gray-800 px-2 py-1 rounded-md">
                {mangaData.episodes
                  ? `${mangaData.episodes} Episodes`
                  : `${mangaData.chapters} Chapters`}
              </span>
              <span className="bg-gray-800 px-2 py-1 rounded-md">{mangaData.type}</span>
              <span className="bg-gray-800 px-2 py-1 rounded-md flex items-center gap-1">
                ❤️ {mangaData.members}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-2 flex-wrap">
              <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-sm flex items-center gap-2">
                <img src="/img/player-play-white.svg" alt="Watch" className="w-4 h-4" />
                Watch Trailer
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-sm flex items-center gap-2">
                <img src="/img/bookmark-white.svg" alt="Bookmark" className="w-4 h-4" />
                Bookmark
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-200 mt-4">{mangaData.synopsis}</p>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mt-3">
              {mangaData.genres?.map((genre: any) => (
                <span
                  key={genre.mal_id}
                  className="bg-[#1D0D39] text-xs px-2 py-1 rounded-md"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <h2 className="text-3xl font-semibold mb-4">Characters</h2>
        <MangaChar mal_id={mangaID} />
      </div>

      <div className="max-w-[92rem] w-full mx-auto px-4 mt-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-semibold">Reviews</h2>
          <div className="flex gap-2">
            <button className="text-lg px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600">
              {"<"}
            </button>
            <button className="text-lg px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600">
              {">"}
            </button>
          </div>
        </div>
        <Review mal_id={mangaID} />
      </div>
    </div>
  );
}