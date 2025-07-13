"use client";

import React, { useState, useEffect, ReactNode } from "react";

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
    <>
      <div className="fixed inset-0 w-full h-[80vh] z-0 overflow-hidden p-8">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover blur-[2px] brightness-[0.3]"
          src={anime.background_video}
          autoPlay
          loop
          muted
        />

        <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_100px_30px_rgba(0,0,0,0.7)]" />

        <div
          className={`absolute inset-0 z-20 flex ml-8 items-end justify-start px-6 sm:px-10 md:px-20 pb-20 md:pb-32 transition-opacity duration-500 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="max-w-2xl text-white">
            <img
              src={anime.logo}
              alt={`${anime.name} logo`}
              className="mb-4 w-60 sm:w-72 md:w-96"
            />
            <p className="text-sm sm:text-base bg-[#38393a] inline-block px-2 py-1 rounded mb-3">
              {anime.age}
            </p>
            <p className="text-sm sm:text-lg md:text-xl mb-6 font-light">
              {anime.description}
            </p>
            <button className="flex items-center gap-2 text-white text-sm sm:text-base bg-gradient-to-r from-[#660000] to-[#e0be2e] hover:bg-white hover:text-[#660000] transition px-5 py-3 rounded-md">
              <img
                src="/img/player-play.svg"
                alt="Play Icon"
                className="w-5 h-5"
              />
              See More
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10">{children}</div>
    </>
  );
}