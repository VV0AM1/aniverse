import { useEffect, useState } from "react";
import { animeServices } from "@/app/lib/services/animes";
import TopCard from "./TopCard";


interface TopProps {
    upcomingAnimes: any[]; 
    airingAnimes: any[];
    topCharacters: any[];
    topManga: any[];
  }

const TopSection: React.FC<TopProps> = ({ upcomingAnimes, airingAnimes, topCharacters, topManga}) => {
 


    return (
        <div className="top-section-container flex">
            <div className="top-upcoming-col flex flex-col">
                <h1 className="top-upcom-tittle">Top Upcoming</h1>
            {upcomingAnimes.slice(0, 5).map((anime, index) => (
            <TopCard key={index} data={anime} index={index} />
          ))}
            </div>
            <div className="top-airing-col flex flex-col">
            <h1 className="top-airing-tittle">Top Airing</h1>
            {airingAnimes.slice(0, 5).map((anime, index) => (
            <TopCard key={index} data={anime} index={index} />
          ))}
            </div>
            <div className="fav-character-col flex flex-col">
            <h1 className="fav-char-tittle">Favorite Characters</h1>
            {topCharacters.slice(0, 5).map((anime, index) => (
            <TopCard key={index} data={anime} index={index} />
          ))}
            </div>
            <div className="fav-manga-col flex flex-col">
            <h1 className="fav-manga-tittle">Favorite Manga</h1>
            {topManga.slice(0, 5).map((anime, index) => (
            <TopCard key={index} data={anime} index={index} />
          ))}
            </div>
        </div>
      );
};

export default TopSection;