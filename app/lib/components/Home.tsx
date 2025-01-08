"use client";

import React, { useState, useEffect, ReactNode } from "react";
import "@/app/globals.css";

const trendingAnime = [
  {
    name: "DanDaDan",
    anime_id: 1,
    age: "+16",
    description:
      "Dandadan is a popular Japanese manga series written and illustrated by Yukinobu Tatsu. The story combines elements of supernatural action, romance, and comedy, creating a unique and engaging experience.",
    background_img: "/img/home_anime_1.png",
    title_img: "/img/home_anime_1_name.png",
  },
  {
    name: "Blue Lock",
    anime_id: 2,
    age: "+16",
    description:
      "Blue Lock is a Japanese manga series written by Muneyuki Kaneshiro and illustrated by Yusuke Nomura. It’s a high-stakes sports drama that redefines the soccer genre with a unique and intense premise.",
    background_img: "/img/home_anime_2.png",
    title_img: "/img/home_anime_2_name.png",
  },
  {
    name: "DanDaDan",
    anime_id: 3,
    age: "+16",
    description:
      "Dandadan is a popular Japanese manga series written and illustrated by Yukinobu Tatsu. The story combines elements of supernatural action, romance, and comedy, creating a unique and engaging experience.",
    background_img: "/img/home_anime_1.png",
    title_img: "/img/home_anime_1_name.png",
  },
  {
    name: "Blue Lock",
    anime_id: 4,
    age: "+16",
    description:
      "Blue Lock is a Japanese manga series written by Muneyuki Kaneshiro and illustrated by Yusuke Nomura. Its a high-stakes sports drama that redefines the soccer genre with a unique and intense premise.",
    background_img: "/img/home_anime_2.png",
    title_img: "/img/home_anime_2_name.png",
  },
  {
    name: "Tower of God",
    anime_id: 5,
    age: "+16",
    description:
      "Tower of God is a South Korean webtoon (manhwa) created by SIU (Slave In Utero). It’s an epic fantasy series that has captured readers worldwide with its intricate storytelling, vast world-building, and compelling characters.",
    background_img: "/img/home_anime_3.png",
    title_img: "/img/home_anime_3_name.png",
  },
];

export default function Home({ children }: { children: ReactNode }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setFade(false); 
        setTimeout(() => {
          setCurrentIndex((prevIndex) =>
            prevIndex === trendingAnime.length - 1 ? 0 : prevIndex + 1
          );
          setFade(true); 
        }, 300); 
      }, 5000); 
  
      return () => clearInterval(interval); 
    }, []);
  
    const anime = trendingAnime[currentIndex];
  
    return (
      <div
        className={`home-container h-screen w-full transition-all duration-300 ease-in-out`}
        style={{
          backgroundImage: `url(${anime.background_img})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className={`anime-content transition-opacity duration-300 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="anime-info">
            <img src={anime.title_img} alt={anime.name} className="anime-title-img" />
            <p className="trendingAnimeAge">{anime.age}</p>
            <p className="trendingAnimeDescription">{anime.description}</p>
            <button className="anime-button"><img src="/img/player-play.svg" alt="" />Watch S1 E1</button>
          </div>
        </div>
        {children}
      </div>
    );
  }