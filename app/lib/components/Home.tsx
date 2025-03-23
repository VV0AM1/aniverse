"use client";

import React, { useState, useEffect, ReactNode } from "react";
import "@/app/globals.css";

const trendingAnime = [
  {
    name: "Jujutsu Kaisen",
    anime_id: 1,
    age: "+16",
    logo: "/img/juju-logo.png",
    description:
      "A thrilling dark fantasy anime that follows Yuji Itadori as he battles curses and uncovers the secrets of Jujutsu sorcery.",
    background_video: "/img/gojosatoru.mp4",
  },
  {
    name: "Solo Leveling",
    anime_id: 2,
    age: "+16",
    logo: "/img/solo-logo.png",
    description:
      "An action-packed series about Sung Jin-Woo, a weak hunter who gains incredible powers and rises to the top.",
    background_video: "/img/solo.mp4",
  },
  {
    name: "Friren",
    anime_id: 3,
    age: "+18",
    logo: "/img/friren-logo.png",
    description:
      "A beautifully crafted fantasy anime that explores the journey of an elven mage, reflecting on the passage of time and lost friendships.",
    background_video: "/img/friren.mp4",
  },
  {
    name: "Naruto Shippuden",
    anime_id: 4,
    age: "+16",
    logo: "/img/naruto-logo.png",
    description:
      "The legendary continuation of Naruto’s journey, filled with epic battles, emotional moments, and the pursuit of becoming Hokage.",
    background_video: "/img/itachi.mp4",
  },
  {
    name: "Chainsaw Man",
    anime_id: 5,
    age: "+16",
    logo: "/img/chainsaw-logo.png",
    description:
      "A dark and brutal action anime about Denji, a devil hunter with the power of a chainsaw, facing off against terrifying devils.",
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
          <img src={anime.logo} alt="" className="mb-3" />
          <p className="trendingAnimeAge">{anime.age}</p>
          <p className="trendingAnimeDescription">{anime.description}</p>
          <button className="anime-button flex items-center gap-2 text-white px-4 py-2 rounded-lg">
            <img src="/img/player-play.svg" alt="Play Icon" className="w-5 h-5" />
            See More
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}