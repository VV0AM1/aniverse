import React, { useRef } from "react";
import Card from "./Card";
import SkeletonCard from "./SkeletonCard";

interface KaruselProps {
  animes: any[];
}

const Karusel: React.FC<KaruselProps> = ({ animes }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.9;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full bg-[#121316] py-6 sm:py-12 overflow-hidden ">
      <div className="px-6 sm:px-12 mb-8 mt-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
          Top Animes Of All Time
          <span className="block h-[4px] w-[90%] md:w-[20%] bg-gradient-to-r from-[#8c5cf6] via-[#9f19be] to-[#ca8d17] mt-1" />
        </h1>
      </div>

      <button
        onClick={() => scroll("left")}
        className="p-2 sm:p-3 absolute top-1/2 left-2 transform -translate-y-1/2 bg-[#2b2c44]/50 hover:bg-[#2b2c44]/80 text-white rounded-full z-10"
      >
        <img src="/img/caret-left.svg" alt="Left" className="w-4 h-4" />
      </button>

      <button
        onClick={() => scroll("right")}
        className="p-2 sm:p-3 absolute top-1/2 right-2 transform -translate-y-1/2 bg-[#2b2c44]/50 hover:bg-[#2b2c44]/80 text-white rounded-full z-10"
      >
        <img src="/img/caret-right.svg" alt="Right" className="w-4 h-4" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-6 sm:px-12 hide-scrollbar touch-pan-x"
      >
        {(animes.length > 0 ? animes : [...Array(7)]).map((anime, index) => (
          <div
            key={index}
            className="min-w-[200px] sm:min-w-[250px] md:min-w-[300px] snap-start"
          >
            {animes.length > 0 ? <Card data={anime} /> : <SkeletonCard />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Karusel;