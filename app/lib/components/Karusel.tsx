import React, { useState } from "react";
import Card from "./Card";
import SkeletonCard from "./SkeletonCard";

interface KaruselProps {
  animes: any[];
}

const Karusel: React.FC<KaruselProps> = ({ animes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleRightClick = () => {
    if (currentIndex < 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (currentIndex === 1) {
      setCurrentIndex(0);
    }
  };

  const handleLeftClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    
    <div className="karusel-container flex flex-col">
      <div className="karusel-title-container">
        <h1 className="karusel-title">Top Animes Of All Time</h1>
      </div>
      <button
        className="karusel-left-btn"
        onClick={handleLeftClick}
        disabled={currentIndex === 0}
      >
        <img src="/img/caret-left.svg" alt="Left" />
      </button>
      <button
        className="karusel-right-btn"
        onClick={handleRightClick}
      >
        <img src="/img/caret-right.svg" alt="Right" />
      </button>
      <div
        className="karusel-items-container flex items-center"
        style={{
          transform: `translateX(${currentIndex === 1 ? '-110vw' : `-${currentIndex * 110}vw`})`,
          transition: "transform 0.5s ease-in-out",
        }}
      >
        {animes.length > 0
          ? animes.map((anime, index) => <Card key={index} data={anime} />)
          : [...Array(5)].map((_, index) => <SkeletonCard key={index} />)}
      </div>
    </div>
  );
};

export default Karusel;