"use client";
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import { useParams } from "next/navigation";
import { animeServices } from "@/app/lib/services/animes";
import Image from 'next/image';
import MangaChar from "./MangaChar";
import Review from "./Review"



export default function MangaDetailed() {
  const { mal_id } = useParams();
  const [mangaData, setMangaData] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!mal_id || Array.isArray(mal_id)) {
    return <div>Invalid anime ID</div>;
  }

  const mangaID = String(mal_id);

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const mangaRes = await animeServices.getMangaById(String(mal_id));
        setMangaData(mangaRes.data.data);
      } catch (error) {
        console.error("Error fetching anime details:", error);
      }
    };

    fetchData();
  }, [mal_id]);



  if (!mangaData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="anime-page w-full justify-center">
        <div className="anime-detailed-info-container w-full">
            <div className="inner-anime-detailed-info-container">
                <div className="inner-anime-content">
                    <div className="anime-detailed-image-container">
                    <Image
                        src={mangaData?.images?.jpg.image_url}
                        width={170}
                        height={240} 
                        alt={mangaData.title}
                        style={{ borderRadius: "15px",
                        width: "170px", 
                        height: "240px"
                        }}
                    />
                    </div>
                    <div className="anime-detailed-text-content flex flex-col">
                        <p className="anime-detailed-title mb-1">{mangaData.title}</p>
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
                        <img src="/img/star-white.svg" alt="star" className='star'/>{mangaData.score}
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
                            {mangaData.duration
                                ? mangaData.duration
                                : `${mangaData.volumes} per chapter`}
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
                            {mangaData.episodes ? `${mangaData.episodes} Episodes` : `${mangaData.chapters} Chapters`}
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
                            {mangaData.type}
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
                            <img src="/img/heart-white.svg" alt="star" className='star'/>{mangaData.members}
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
                            {mangaData.synopsis}
                        </p>
                        <div className="anime-detailed-genres-list flex flex-wrap mt-3">
                        {mangaData.genres && mangaData.genres.map((genre: any) => (
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
            <MangaChar mal_id={mangaID} />
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
        </div>
    </div>
  );
}