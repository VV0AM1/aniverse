import React, { useState } from "react";
import SkeletonCard from "./SkeletonCard";
import SeasonalCard from "./SeasonalCard";


interface KaruselProps {
  animes: any[];
}

const Karusel: React.FC<KaruselProps> = ({ animes }) => {
  const [currentIndex, setCurrentIndex] = useState(0); 




  const cardWidth = 240;
  const visibleCards = 7;
  const totalCards = animes.length >= 15 ? 15 : animes.length;
  const maxIndex = totalCards - visibleCards-1;

  const handleRightClick = () => {
    setCurrentIndex((prev) => {
      if (prev < maxIndex) {
        return prev + 1;
      } else {
        return 0; 
      }
    });
  };

  const handleLeftClick = () => {
    setCurrentIndex((prev) => {
      if (prev > 0) {
        return prev - 1;
      } else {
        return maxIndex; 
      }
    });
  };

  return (
    <div className="karusel-container-seasonal flex flex-col relative overflow-hidden">
      <div className="karusel-title-container">
        <h1 className="karusel-title-seasonal">Seasonal Anime</h1>
      </div>
    <div className="seasonal-aditional flex justify-between mt-2">
        <p className="seasonal">Spring 2025</p>
        <a className="seasonal-more-btn" href="/Airing">View More {'>>'}</a>
    </div>
      <button
        className="karusel-left-btn absolute left-0 top-1/2 transform mt-8 z-10"
        onClick={handleLeftClick}
      >
        <img src="/img/caret-left.svg" alt="Left" />
      </button>

      <button
        className="karusel-right-btn absolute right-0 top-1/2 transform mt-8 z-10"
        onClick={handleRightClick}
        disabled={currentIndex >= maxIndex} 
      >
        <img src="/img/caret-right.svg" alt="Right" />
      </button>

      <div className="overflow-hidden w-full mt-2">
        <div
          className="karusel-items-container flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * cardWidth}px)`, 
            transition: "transform 0.5s ease-in-out",
          }}
        >
          {animes.length > 0
            ? animes.slice(0, 15).map((anime, index) => (
                <SeasonalCard key={index} data={anime} index={index} />
              ))
            : [...Array(5)].map((_, index) => <SkeletonCard key={index} />)}
        </div>
      </div>
    </div>
  );
};

export default Karusel;