"use client";
import React, { useEffect, useState } from "react";
import { animeServices } from "@/app/lib/services/animes";
import { useRouter } from 'next/navigation';

interface RecomendsProps {
  mal_id: string;
}

export default function AnimeRecomendation({ mal_id }: RecomendsProps) {
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
          console.error("Error fetching character details:", error);
        }
      };

      fetchData();
    }, 1500); 

    return () => clearTimeout(timer); 
  }, [mal_id]);

  if (!recData || recData.length === 0) {
    return <div>Loading characters...</div>;
  }



  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[2px] mt-2">
      {recData.slice(0, 20).map((recomend: any) => {
        const { entry: recInfo } = recomend;
        return (
          <div
            key={recInfo.mal_id}
            className="recomend-card relative mt-4 mb-2"
            style={{ width: "230px", height: "300px" }}
            onClick={() => router.push(`/animes/${recInfo.mal_id}`)}

          >
            <img
              src={recInfo.images?.jpg?.image_url || ""}
              alt={recInfo.tittle}
              className=" img-recomend w-full"
            />
  
            <span className="recomend-name text-white mt-2 ml-2">
              {recInfo.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}