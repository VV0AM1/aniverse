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
        aired: {
          string: string
        }
        published: {
          string: string
        }
        genres: { name: string }[];
        titles: { type: string; title: string }[];
        status: string;
        synopsis: string;
        score: string;
        year: string;
        chapters: string;
        duration: string;
        volumes: string;
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

    const japaneseTitle = data.titles.find(t => t.type === "Japanese")?.title || "N/A";


    const handleRedirect = () => {
      router.push(`/animes/${data.mal_id}`)
    };

    const genreNames = data.genres ? data.genres.map((genre) => genre.name).join(', ') : 'No genres available';

    const isLastInRow = (index + 1) % 5 === 0;

    const formatRating = (rating?: string) => {
      if (!rating) return "14+";
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
            <p className="duration-small">
            {data.duration
            ? data.duration.replace(' per ep', '')
            : `${data.volumes} per chapter`}
            </p>
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
              height: "300px", 
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
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 600,
                margin: "0 0 8px",
                color: "#fff",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
              }}
            >
              {data.title}
            </h2>
            <p style={{ fontSize: "13px", color: "#ddd", marginBottom: "6px" }}>
              {data.episodes ? `${data.episodes} Episodes` : `${data.chapters} Chapters`} | {data.year}
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
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {data.synopsis}
            </p>
              <div className="additional-info-container flex flex-col mt-2">
                <p className='additional-info'><b style={{
                  fontSize: "12px",
                }}>Japanese: </b>{japaneseTitle}</p>
                <p className='additional-info'><b style={{
                  fontSize: "12px",
                }}>Aired: </b> {data.aired?.string ? data.aired.string.split(" to ")[0] : data.published?.string}</p>
                <p className='additional-info'><b style={{
                  fontSize: "12px",
                }}>Status: </b>{data.status}</p>
              </div>
          </div>
        )}
      </div>
    );
  }