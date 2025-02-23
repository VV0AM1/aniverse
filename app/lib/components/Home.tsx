"use client";

import React, { useState, useEffect, ReactNode } from "react";
import "@/app/globals.css";

const trendingAnime = [
  {
    name: "Jujutsu Kaisen",
    anime_id: 1,
    age: "+16",
    description:
      "Dandadan is a popular Japanese manga series written and illustrated by Yukinobu Tatsu. The story combines elements of supernatural action, romance, and comedy, creating a unique and engaging experience.",
    background_video: "/img/gojosatoru.mp4",
  },
  {
    name: "Code Gease",
    anime_id: 2,
    age: "+16",
    description:
      "Blue Lock is a Japanese manga series written by Muneyuki Kaneshiro and illustrated by Yusuke Nomura. It’s a high-stakes sports drama that redefines the soccer genre with a unique and intense premise.",
    background_video: "/img/solo.mp4",
  },
  {
    name: "Tokyo Ghoul",
    anime_id: 3,
    age: "+18",
    description:
      "Dandadan is a popular Japanese manga series written and illustrated by Yukinobu Tatsu. The story combines elements of supernatural action, romance, and comedy, creating a unique and engaging experience.",
    background_video: "/img/friren.mp4",
  },
  {
    name: "Demon Slayer",
    anime_id: 4,
    age: "+16",
    description:
      "Blue Lock is a Japanese manga series written by Muneyuki Kaneshiro and illustrated by Yusuke Nomura. It’s a high-stakes sports drama that redefines the soccer genre with a unique and intense premise.",
    background_video: "/img/itachi.mp4",
  },
  {
    name: "Fate: Another Story",
    anime_id: 5,
    age: "+16",
    description:
      "Tower of God is a South Korean webtoon (manhwa) created by SIU (Slave In Utero). It’s an epic fantasy series that has captured readers worldwide with its intricate storytelling, vast world-building, and compelling characters.",
    background_video: "/img/chainsaw.mp4",
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
    <div className="home-container h-screen w-full relative">
      <div className="shadow"></div>
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={anime.background_video}
        autoPlay
        loop
        muted
      ></video>
      <div
        className={`anime-content relative z-10 transition-opacity duration-300 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="anime-info p-6 text-white">
          <p className="trendingAnimeAge">{anime.age}</p>
          <p className="trendingAnimeDescription">{anime.description}</p>
          <button className="anime-button flex items-center gap-2 text-white px-4 py-2 rounded-lg">
            <img src="/img/player-play.svg" alt="Play Icon" className="w-5 h-5" />
            Watch S1 E1
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}