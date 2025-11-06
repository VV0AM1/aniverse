"use client";

import React, { useEffect, useState } from "react";
import { animeServices } from "@/app/lib/services/animes";

interface CharacterProps {
  mal_id: string;
}

export default function Character({ mal_id }: CharacterProps) {
  const [characterData, setCharacterData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mal_id || Array.isArray(mal_id)) return;

    const fetchData = async () => {
      try {
        const characterRes = await animeServices.character(String(mal_id));
        setCharacterData(characterRes.data.data || []);
      } catch (error) {
        console.error("Error fetching character details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mal_id]);

  if (loading) {
    return (
      <div className="text-white text-center py-10 text-lg font-medium">
        Loading characters...
      </div>
    );
  }

  if (!characterData || characterData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[100px] text-white text-base">
        <h2 className="text-2xl font-semibold mb-2">Characters</h2>
        <p className="text-gray-400">No Characters Available (╥﹏╥)</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Characters</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
        {characterData.slice(0, 20).map((character: any) => {
          const { character: charInfo, role } = character;

          const roleColor =
            role.toLowerCase() === "main"
              ? "bg-green-600/70"
              : role.toLowerCase() === "supporting"
              ? "bg-yellow-600/70"
              : "bg-gray-700";

          return (
            <div
              key={charInfo.mal_id}
              className="relative rounded-md overflow-hidden w-full aspect-[9/10] bg-gray-800 shadow-md"
            >
              <img
                src={charInfo.images?.jpg?.image_url || ""}
                alt={charInfo.name}
                className="w-full h-full object-cover"
              />

              <span
                className={`absolute top-1 left-1 text-xs text-white px-2 py-0.5 rounded ${roleColor}`}
              >
                {role}
              </span>

              <span className="absolute bottom-1 left-1 text-xs text-white bg-black/50 px-2 py-0.5 rounded">
                {charInfo.name}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}