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
        const mangaCharacterRes = await animeServices.getMangaCharacters(String(mal_id));
        setMangaCharacterData(mangaCharacterRes.data.data);
      } catch (error) {
        console.error("Error fetching character details:", error);
      }
    };

    fetchData();
  }, [mal_id]);

  if (!mangaCharacterData || mangaCharacterData.length === 0) {
    return <div>Loading characters...</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[2px] mt-2">
      {mangaCharacterData.slice(0, 20).map((character: any) => {
        const { character: charInfo, role } = character;
        return (
          <div
            key={charInfo.mal_id}
            className="character-card relative overflow-hidden mt-4"
            style={{ width: "210px", height: "230px" }}

          >
            <img
              src={charInfo.images?.jpg?.image_url || ""}
              alt={charInfo.name}
              className="w-full h-full object-cover"
            />
  
            <span className="character-role absolute top-1 left-1 text-white"
            style={{
              backgroundColor:
                role.toLowerCase() === "main"
                  ? "#56aa28a8"
                  : role.toLowerCase() === "supporting"
                  ? "#bb7606b0"
                  : "#444", 
            }}
            >
              {role}
            </span>
  
            <span className="character-title-detailed absolute bottom-1 left-1 text-white">
              {charInfo.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}