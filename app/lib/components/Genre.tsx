"use client"

import React from "react";
import SmallCard from "./SmallCard";

interface GenreProps {
  genre: string;
  animes: any[]; 
}

const Genre: React.FC<GenreProps> = ({ genre, animes }) => {

  const filteredAnimes = animes?.filter((anime) =>
    anime.genres?.some((genreItem: any) => genreItem.name === genre)
  );  

  return (
    <div className="genre-container flex flex-col">
      <div className="genre-title-container">
        <h1 className="genre-title">{genre} Animes</h1>
      </div>
      <div className="genre-item-container grid grid-cols-5 gap-4">
        {filteredAnimes?.map((anime, index) => (
          <SmallCard key={index} data={anime} />
        ))}
      </div>
    </div>
  );
};

export default Genre;