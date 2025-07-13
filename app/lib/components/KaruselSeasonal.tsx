"use client";

import React, { useState } from "react";
import SkeletonCard from "./SkeletonCard";
import SeasonalCard from "./SeasonalCard";

interface KaruselProps {
  animes: any[];
}

const SeasonalKarusel: React.FC<KaruselProps> = ({ animes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const cardWidth = 240;
  const visibleCards = 7;
  const totalCards = animes.length >= 15 ? 15 : animes.length;
  const maxIndex = totalCards - visibleCards - 1;

  const handleRightClick = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const handleLeftClick = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  return (
      <section
        className="w-full relative px-4 sm:px-12 py-12 bg-[#121316] bg-cover bg-center bg-no-repeat"
      >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white">
          Seasonal Anime
        </h2>
        <div className="flex items-center text-sm sm:text-base gap-4 mt-2 sm:mt-0 text-gray-400">
          <p className="bg-purple-800/30 text-purple-300 px-3 py-1 rounded-full text-xs font-medium">
            Spring 2025
          </p>
          <a
            href="/Airing"
            className="text-purple-400 hover:text-purple-300 transition font-medium"
          >
            View More &gt;&gt;
          </a>
        </div>
      </div>

      <button
        onClick={handleLeftClick}
        className="p-3 absolute top-1/2 left-2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
      >
        <img src="/img/caret-left.svg" alt="Left" className="w-4 h-4" />
      </button>

      <button
        onClick={handleRightClick}
        className="p-3 absolute top-1/2 right-2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full disabled:opacity-30"
        disabled={currentIndex >= maxIndex}
      >
        <img src="/img/caret-right.svg" alt="Right" className="w-4 h-4" />
      </button>

      <div className="overflow-hidden w-full">
        <div
          className="flex transition-transform duration-500 ease-in-out gap-4"
          style={{
            transform: `translateX(-${currentIndex * cardWidth}px)`,
          }}
        >
          {(animes.length > 0 ? animes.slice(0, 15) : [...Array(7)]).map((anime, index) => (
            <div key={index} className="min-w-[240px]">
              {animes.length > 0 ? (
                <SeasonalCard data={anime} index={index} />
              ) : (
                <SkeletonCard />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeasonalKarusel;