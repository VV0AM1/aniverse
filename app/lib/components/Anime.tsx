"use client";
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import { useParams } from "next/navigation";
import { animeServices } from "@/app/lib/services/animes";
import Image from 'next/image';
import Character from "./Character";
import Review from "./Review"



export default function Anime() {
  const { mal_id } = useParams();
  const [animeData, setAnimeData] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const reviewRef = useRef<any>(null);


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
                        <p className="anime-watch-trailer-btn"
                        style={{
                            fontSize: "16px",
                            padding: "6px 10px",
                            display: "flex",
                            width: "auto",
                            height: "34px",
                            fontWeight: 200,
                            alignItems: "center"
                        }}
                        >
                            <img src="/img/player-play-white.svg" alt="star" className='play-icon'/>Watch Trailer
                        </p>
                        <p className="anime-bookmark-btn"
                        style={{
                            fontSize: "16px",
                            padding: "6px 10px",
                            display: "flex",
                            width: "auto",
                            height: "34px",
                            fontWeight: 200,
                            alignItems: "center"
                        }}
                        >
                        <img src="/img/bookmark-white.svg" alt="star" className='bookmark'/>Bookmark
                        </p>
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
                  <button onClick={() => reviewRef.current?.scrollLeft()} className="reviews-btn-prev">
        {"<"}
      </button>
      <button onClick={() => reviewRef.current?.scrollRight()} className="reviews-btn-next">
        {">"}
      </button>
                  </div>
                </div>
                <Review mal_id={animeId} ref={reviewRef} />
        </div>
    </div>
  );
}