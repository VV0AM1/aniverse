"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { animeServices } from "@/app/lib/services/animes";

export default function Anime() {
  const { mal_id } = useParams();
  const [animeData, setAnimeData] = useState<any>(null);

  useEffect(() => {
    if (!mal_id || Array.isArray(mal_id)) return;

    const fetchData = async () => {
      try {
        const animeRes = await animeServices.getByIdFull(String(mal_id));
        setAnimeData(animeRes.data.data);
      } catch (error) {
        console.error("Error fetching anime details:", error);
      }
    };

    fetchData();
  }, [mal_id]);

  if (!animeData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="anime-page">
      <div className="main-anime-info">
        <img
          src={animeData?.images?.jpg?.image_url || ""}
          alt={animeData?.title}
          className="anime-img"
        />
        <div className="anime-texts">
          <h2 className="anime-title">{animeData?.title}</h2>
          <p className="anime-description">{animeData?.synopsis}</p>
        </div>
      </div>
      <div className="anime-info">
        <div className="production-anime-info">
          <p className="production-text">Studio</p>
          {animeData?.studios?.map((studio: any) => studio.name).join(", ")}
        </div>
        <div className="production-anime-info">
          <p className="production-text">Producers</p>
          {animeData?.producers?.map((producer: any) => producer.name).join(", ")}
        </div>
        <div className="production-anime-info">
          <p className="production-text">Genre</p>
          {animeData?.genres?.map((genre: any) => genre.name).join(", ")}
        </div>
      </div>
    </div>
  );
}