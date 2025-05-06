import { useState, useEffect } from "react";
import TopSkeletonLoader  from "./TopSkeletonLoader";  
import TopCard from "./TopCard"; 

interface TopProps {
  upcomingAnimes: any[]; 
  airingAnimes: any[];
  topCharacters: any[];
  topManga: any[];
}

const TopSection: React.FC<TopProps> = ({ upcomingAnimes, airingAnimes, topCharacters, topManga }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="top-section-container flex">
      <div id="top-col" className="top-upcoming-col flex flex-col">
        <h1 className="top-title-home-col">Top Upcoming</h1>
        {loading
          ? [...Array(5)].map((_, index) => <TopSkeletonLoader key={index} />)
          : upcomingAnimes.slice(0, 5).map((anime, index) => (
              <TopCard key={index} data={anime} index={index} />
            ))}
      </div>

      <div id="top-col" className="top-airing-col flex flex-col">
        <h1 className="top-title-home-col">Top Airing</h1>
        {loading
          ? [...Array(5)].map((_, index) => <TopSkeletonLoader key={index} />)
          : airingAnimes.slice(0, 5).map((anime, index) => (
              <TopCard key={index} data={anime} index={index} />
            ))}
      </div>

      <div id="top-col" className="fav-character-col flex flex-col">
        <h1 className="top-title-home-col">Favorite Characters</h1>
        {loading
          ? [...Array(5)].map((_, index) => <TopSkeletonLoader key={index} />) 
          : topCharacters.slice(0, 5).map((anime, index) => (
              <TopCard key={index} data={anime} index={index} />
            ))}
      </div>

      <div id="top-col" className="fav-manga-col flex flex-col">
        <h1 className="top-title-home-col">Favorite Manga</h1>
        {loading
          ? [...Array(5)].map((_, index) => <TopSkeletonLoader key={index} />) 
          : topManga.slice(0, 5).map((anime, index) => (
              <TopCard key={index} data={anime} index={index} />
            ))}
      </div>
    </div>
  );
};

export default TopSection;