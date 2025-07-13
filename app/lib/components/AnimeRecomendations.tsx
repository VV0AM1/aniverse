"use client";

import React, { useEffect, useState } from "react";
import { animeServices } from "@/app/lib/services/animes";
import { useRouter } from "next/navigation";

interface RecommendsProps {
  mal_id: string;
}

export default function AnimeRecomendation({ mal_id }: RecommendsProps) {
  const [recData, setRecData] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!mal_id || Array.isArray(mal_id)) return;

    const timer = setTimeout(() => {
      const fetchData = async () => {
        try {
          const recRes = await animeServices.getanimeRecomendations(String(mal_id));
          setRecData(recRes.data.data);
        } catch (error) {
          console.error("Error fetching recommendations:", error);
        }
      };

      fetchData();
    }, 1000);

    return () => clearTimeout(timer);
  }, [mal_id]);

  if (!recData || recData.length === 0) {
    return <div className="text-gray-300">Loading recommendations...</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
      {recData.slice(0, 20).map((rec: any) => {
        const { entry: recInfo } = rec;

        return (
          <div
            key={recInfo.mal_id}
            className="cursor-pointer transform hover:scale-[1.03] transition duration-200 ease-in-out rounded overflow-hidden shadow-lg bg-[#1c1c1c]"
            onClick={() => router.push(`/animes/${recInfo.mal_id}`)}
          >
            <img
              src={recInfo.images?.jpg?.image_url || ""}
              alt={recInfo.title}
              className="w-full h-[300px] object-cover"
            />
            <div className="p-2 text-sm text-white font-medium line-clamp-2">
              {recInfo.title}
            </div>
          </div>
        );
      })}
    </div>
  );
}
