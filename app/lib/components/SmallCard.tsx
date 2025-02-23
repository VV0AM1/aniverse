"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SmallCard({
    data,
    index,
}: {
    data: {
        mal_id: string;
        title: string;
        episodes: string;
        images: {
            jpg: { image_url: string; large_image_url: string; small_image_url: string };
            webp: { image_url: string; large_image_url: string; small_image_url: string };
        };
        genres: { name: string }[];
        synopsis: string;
        score: string;
        year: string;
        duration: string;
        rating: string;
        type: string;
        rank: string;
        popularity: string;
        members: string;
        producers: { name: string }[];
        studios: { name: string }[];
        trailer: {
            url: string;
            images: {image_url: string; large_image_url: string; small_image_url: string; medium_image_url: string }
        };
        scored_by: string;
    };
    index: number;
}) {
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();

    const handleRedirect = () => {
        router.push(
            `/Anime?mal_id=${encodeURIComponent(data.mal_id)}&title=${encodeURIComponent(data.title)}&episodes=${data.episodes}&image_url=${encodeURIComponent(
                data.images.jpg.large_image_url
            )}&synopsis=${encodeURIComponent(data.synopsis)}&score=${data.score}&year=${data.year}&genres=${encodeURIComponent(
                data.genres.map((g) => g.name).join(', ')
            )}&producers=${encodeURIComponent(
                data.producers.map((p) => p.name).join(', ')
            )}&studios=${encodeURIComponent(
                data.studios.map((s) => s.name).join(', ')
            )}&trailerImageUrl=${encodeURIComponent(
                data.trailer.images.medium_image_url
            )}&trailerUrl=${encodeURIComponent(data.trailer.url)}&rating=${data.rating}&scored_by=${data.scored_by}`
        );
    };

    const genreNames = data.genres ? data.genres.map((genre) => genre.name).join(', ') : 'No genres available';

    const isLastInRow = (index + 1) % 5 === 0;

    const formatRating = (rating: string) => {
      return rating.replace(/(-.{3}).*/, "$1");
    };


    return (
      <div
        className="small-card-container"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        style={{position: "relative",
                cursor: "pointer",
                width: "170px",
                height: "300px",
                borderRadius: "5px"
          }}
      >
      <img src="/img/player-big.svg" alt="play" className='play-big-btn'/>
        <div
          className='small-card'
          onClick={handleRedirect}
          style={{
            width: "160px",
            height: "300px", 
            borderRadius: "5px",
            overflow: "hidden",
            position: "relative",
          }}
        >
        
          <Image
            src={data?.images?.jpg.image_url}
            width={150}
            height={270} 
            alt={data.title}
            style={{ borderRadius: "5px",
              width: "100%", 
              height: "80%"
             }}
          />
          <div className="title-data-container">
          <h1 className="anime-small-tittle" 
          style={{
            fontSize: "12px",
            color: "#ddd",
            marginTop: "8px",
            marginLeft: "10px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}
          >
            {data.title}
          </h1>
          <div className="aditional-info">
          <p className="duration-small">{data.duration.replace(' per ep', '')}</p>
          <p className="small-type">{data.type}</p>
          </div>
        </div>
        </div>
  
        {isVisible && (
          <div
            className="info-card"
            style={{
              position: "absolute",
              top: "0",
              left: "100px",
              width: "320px", 
              height: "270px", 
              padding: "10px",
              background: "rgba(25, 25, 25, 0.6)",
              backdropFilter: "blur(12px)",
              borderRadius: "12px",
              color: "111",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)",
              zIndex: 100,
              display: "block",
              pointerEvents: "none", 
              opacity: 1,
            }}
          >
            <h2 style={{ fontSize: "18px", fontWeight: "600", margin: "0 0 8px", color: "#fff" }}>{data.title}</h2>
            <p style={{ fontSize: "13px", color: "#ddd", marginBottom: "6px" }}>
              {data.episodes} Episodes | {data.year}
            </p>
            <div className="caracteistics">
            <p
              style={{
                fontSize: "10px",
                background: "#79a3b1",
                padding: "4px 8px",
                borderRadius: "3px",
                display: "flex",
                height: "24px",
                alignItems: "center"
              }}
            >
              {/**B0E3AF FFDD95 E3B5CD FFFFFF */}
              <img src="/img/star.svg" alt="star" className='star'/>{data.score}
            </p>
            <p
              style={{
                fontSize: "10px",
                background: "#a3b179",
                padding: "4px 8px",
                borderRadius: "3px",
                display: "flex",
                height: "24px",
                alignItems: "center"
              }}
            >
              {formatRating(data.rating)}
            </p>
            <p
              style={{
                fontSize: "10px",
                background: "#FFFFFF",
                padding: "4px 8px",
                borderRadius: "3px",
                display: "flex",
                height: "24px",
                alignItems: "center"
              }}
            >
              <img src="/img/medal.svg" alt="star" className='medal'/>{data.rank}
            </p>
            <p
              style={{
                fontSize: "10px",
                background: "#B0E3AF",
                padding: "4px 8px",
                borderRadius: "3px",
                display: "flex",
                height: "24px",
                alignItems: "center"
              }}
            >
            <img src="/img/heart.svg" alt="star" className='heart'/>{data.popularity}
            </p>
            <p
              style={{
                fontSize: "10px",
                background: "#FFDD95",
                padding: "4px 8px",
                borderRadius: "3px",
                display: "flex",
                height: "24px",
                alignItems: "center"
              }}
            >
              <img src="/img/eye.svg" alt="star" className='eye'/>{data.members}
            </p>
            </div>
            <p
              style={{
                fontSize: "12px",
                color: "#ddd",
                marginTop: "8px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 5,
                WebkitBoxOrient: "vertical",
              }}
            >
              {data.synopsis}
            </p>
          </div>
        )}
      </div>
    );
  }