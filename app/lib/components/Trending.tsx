"use client";

import React from "react";
import SmallCard from "./SmallCard";

interface TrendingProps {
  animes: any[];
}

const Trending: React.FC<TrendingProps> = ({ animes }) => {
  return (
    <div className="genre-container flex flex-col">
      <div className="genre-title-container">
        <h1 className="genre-title">Trending Animes</h1>
      </div>
      <div className="genre-item-container grid grid-cols-5 gap-4">
        {animes?.map((anime, index) => (
          <SmallCard key={index} data={anime} />
        ))}
      </div>
    </div>
  );
};

export default Trending;