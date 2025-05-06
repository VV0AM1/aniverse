"use client";
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import { useParams } from "next/navigation";
import { animeServices } from "@/app/lib/services/animes";
import Image from 'next/image';
import Character from "./Character";
import Review from "./Review"
import Socials from "./Socials";
import AnimeRecomendation from "./AnimeRecomendations";
import Footer from "./Footer"

export default function Anime() {
  const { mal_id } = useParams();
  const [animeData, setAnimeData] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [nickname, setNickname] = useState<string | null>(null);

  if (!mal_id || Array.isArray(mal_id)) {
    return <div>Invalid anime ID</div>;
  }

  const animeId = String(mal_id);

  useEffect(() => {
    
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

  useEffect(() => {
    const storedNickname = localStorage.getItem('nickname');
    if (storedNickname) {
      setNickname(storedNickname);
    }
  }, []);


  const handleAnimeAction = async (actionType: string) => {
    if (!nickname) {
      alert("You're not logged in!");
      return;
    }

    try {
      const res = await fetch('/api/anime/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  if (!animeData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="anime-page w-full justify-center">
        <div className="anime-detailed-info-container w-full">
            <div className="inner-anime-detailed-info-container">
                <div className="inner-anime-content">
                    <div className="anime-detailed-image-container">
                    <Image
                        src={animeData?.images?.jpg.image_url}
                        width={170}
                        height={240} 
                        alt={animeData.title}
                        style={{ borderRadius: "15px",
                        width: "170px", 
                        height: "240px"
                        }}
                    />
                    </div>
                    <div className="anime-detailed-text-content flex flex-col">
                        <p className="anime-detailed-title mb-1">{animeData.title}</p>
                        <div className="anime-detailed-category-container flex">
                        <p
                        style={{
                            fontSize: "12px",
                            padding: "4px 8px",
                            borderRadius: "5px",
                            display: "flex",
                            width: "auto",
                            height: "28px",
                            alignItems: "center"
                        }}
                        >
                        <img src="/img/star-white.svg" alt="star" className='star'/>{animeData.score}
                        </p>
                        <p
                        style={{
                            fontSize: "12px",
                            padding: "4px 8px",
                            borderRadius: "5px",
                            display: "flex",
                            width: "auto",
                            height: "28px",
                            alignItems: "center"
                        }}
                        >
                            {animeData.duration
                                ? animeData.duration
                                : `${animeData.volumes} per chapter`}
                        </p>
                        <p
                        style={{
                            fontSize: "12px",
                            padding: "4px 8px",
                            borderRadius: "5px",
                            display: "flex",
                            width: "auto",
                            height: "28px",
                            alignItems: "center"
                        }}
                        >
                            {animeData.episodes ? `${animeData.episodes} Episodes` : `${animeData.chapters} Chapters`}
                        </p>
                        <p
                        style={{
                            fontSize: "12px",
                            padding: "4px 8px",
                            borderRadius: "5px",
                            display: "flex",
                            width: "auto",
                            height: "28px",
                            alignItems: "center"
                        }}
                        >
                            {animeData.type}
                        </p>
                        <p
                        style={{
                            fontSize: "12px",
                            padding: "4px 8px",
                            borderRadius: "5px",
                            display: "flex",
                            width: "auto",
                            height: "28px",
                            alignItems: "center"
                        }}
                        >
                            <img src="/img/heart-white.svg" alt="star" className='star'/>{animeData.members}
                        </p>
                        </div>
                        <div className="anime-detailed-buttons-container flex mt-2">
                        <a className="anime-watch-trailer-btn mt-4"
                        style={{
                            fontSize: "16px",
                            padding: "6px 10px",
                            display: "flex",
                            width: "auto",
                            height: "34px",
                            fontWeight: 200,
                            alignItems: "center"
                        }}
                        href={animeData.trailer?.url}
                        >
                            <img src="/img/player-play-white.svg" alt="star" className='play-icon'/>Watch Trailer
                        </a>
                        <div className="anime-action-buttons">
                          {["bookmark", "later", "liked", "watched"].map((action) => (
                          <button
                          key={action}
                          className="anime-action-btn mt-4 ml-2"
                          style={{
                          fontSize: "16px",
                          padding: "6px 10px",
                          width: "auto",
                          height: "34px",
                          fontWeight: 200,
                          display: "flex",
                          alignItems: "center",
                          color: "white",
                          borderRadius: "2px"
                          }}
                          onClick={() => handleAnimeAction(action)}
                          >
                          <a href="">{action.charAt(0).toUpperCase() + action.slice(1)}</a>
                          </button>
                          ))}
                        </div>
                        </div>
                        <p className="anime-detailed-description">
                            {animeData.synopsis}
                        </p>
                        <div className="anime-detailed-genres-list flex flex-wrap mt-3">
                        {animeData.genres && animeData.genres.map((genre: any) => (
                        <p
                        key={genre.mal_id}
                        style={{
                        fontSize: "12px",
                        padding: "4px 8px",
                        borderRadius: "5px",
                        backgroundColor: "#1D0D39",
                        marginRight: "8px",
                        marginBottom: "8px",
                        height: "32px"
                      }}
                    >
                      {genre.name}
                    </p>
                  ))}
                    </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="character-container flex-col">
            <h1 className="characters-tittle">Characters</h1>
            <Character mal_id={animeId} />
        </div>
        <div className="anime-review-container flex-col">
                <div className="reviews-upper-container flex">
                <h1 className="reviews-tittle">Reviews</h1>
                  <div className="reviews-button-control">
                  <button className="reviews-btn-prev">
                    {"<"}
                  </button>
                  <button className="reviews-btn-next">
                    {">"}
                  </button>
                  </div>
                </div>
                <Review mal_id={animeId}/>
        </div>
        <div className="mt-6 w-full">
          <Socials />
        </div>
        <div className="recomends-container flex-col mt-6 w-full">
          <h1 className="recomends-tittle">Recommendations</h1>
          <AnimeRecomendation  mal_id={animeId}/>
        </div>
        <Footer />
    </div>
  );
}