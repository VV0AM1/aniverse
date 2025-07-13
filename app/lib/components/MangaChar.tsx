"use client";

import React, { useEffect, useState } from "react";
import { animeServices } from "@/app/lib/services/animes";

interface MangaCharacterProps {
  mal_id: string;
}

export default function MangaChar({ mal_id }: MangaCharacterProps) {
  const [mangaCharacterData, setMangaCharacterData] = useState<any[]>([]);

  useEffect(() => {
    if (!mal_id || Array.isArray(mal_id)) return;

    const fetchData = async () => {
      try {
        const res = await animeServices.getMangaCharacters(String(mal_id));
        setMangaCharacterData(res.data.data);
      } catch (error) {
        console.error("Error fetching character details:", error);
      }
    };

    fetchData();
  }, [mal_id]);

  if (!mangaCharacterData || mangaCharacterData.length === 0) {
    return <div className="text-white text-sm">Loading characters...</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {mangaCharacterData.slice(0, 20).map(({ character: charInfo, role }: any) => (
        <div
          key={charInfo.mal_id}
          className="relative overflow-hidden w-full aspect-[7/8] rounded-lg shadow-md group"
        >
          <img
            src={charInfo.images?.jpg?.image_url || ""}
            alt={charInfo.name}
            className="w-full h-full object-cover rounded-lg group-hover:brightness-90 transition"
          />

          <span
            className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-md text-white ${
              role.toLowerCase() === "main"
                ? "bg-green-600/80"
                : role.toLowerCase() === "supporting"
                ? "bg-yellow-600/80"
                : "bg-gray-600/80"
            }`}
          >
            {role}
          </span>

          <span className="absolute bottom-2 left-2 text-sm font-medium bg-black/70 px-2 py-1 rounded-md text-white">
            {charInfo.name}
          </span>
        </div>
      ))}
    </div>
  );
}