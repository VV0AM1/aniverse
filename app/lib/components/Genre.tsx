"use client";

import React, { useState } from "react";
import SmallCard from "./SmallCard";
import SkeletonLoader from "./SkeletonLoader";

interface GenreProps {
  genre: string;
  animes: any[];
  currentPages: number;
  lastPages: number;
  setCurrentPages: (page: number) => void;
  loading: boolean;
}

const Genre: React.FC<GenreProps> = ({
  genre,
  animes,
  currentPages,
  lastPages,
  setCurrentPages,
  loading,
}) => {
  const [inputPage, setInputPage] = useState<number | string>("");

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= lastPages) {
      setCurrentPages(page);
    }
  };

  const handleGoToPage = () => {
    const pageNumber = Number(inputPage);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= lastPages) {
      setCurrentPages(pageNumber);
      setInputPage("");
    }
  };

  return (
    <div className="flex flex-col px-4 sm:px-10 py-8 text-white mb-6">
      <div className="w-full flex flex-col items-center gap-4 mb-8 px-4 mt-[100px]">
        <h1 className="text-3xl sm:text-4xl font-semibold text-white text-center">
          {genre} Animes
        </h1>

        <div className="flex flex-wrap justify-center items-center gap-2 text-sm sm:text-base">
          <button
            className="px-3 py-1 rounded bg-[#1f1f1f] text-white hover:bg-purple-600 transition"
            onClick={() => handlePageChange(1)}
            disabled={currentPages === 1}
          >
            1
          </button>

          {currentPages > 3 && <p className="text-gray-400">...</p>}

          {currentPages > 2 && (
            <button
              className="px-3 py-1 rounded bg-[#1f1f1f] text-white hover:bg-purple-600 transition"
              onClick={() => handlePageChange(currentPages - 1)}
            >
              {currentPages - 1}
            </button>
          )}

          {currentPages !== 1 && currentPages !== lastPages && (
            <button className="px-3 py-1 rounded bg-purple-600 text-white font-semibold cursor-default">
              {currentPages}
            </button>
          )}

          {currentPages < lastPages - 1 && (
            <button
              className="px-3 py-1 rounded bg-[#1f1f1f] text-white hover:bg-purple-600 transition"
              onClick={() => handlePageChange(currentPages + 1)}
            >
              {currentPages + 1}
            </button>
          )}

          {currentPages < lastPages - 2 && <p className="text-gray-400">...</p>}

          {lastPages > 1 && (
            <button
              className="px-3 py-1 rounded bg-[#1f1f1f] text-white hover:bg-purple-600 transition"
              onClick={() => handlePageChange(lastPages)}
            >
              {lastPages}
            </button>
          )}

          <input
            className="w-16 px-2 py-1 rounded bg-[#2a2a2a] text-white text-center outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Page"
            value={inputPage}
            onChange={(e) => setInputPage(e.target.value)}
          />

          <button
            className="px-3 py-1 rounded bg-yellow-400 text-black hover:bg-yellow-300 transition"
            onClick={handleGoToPage}
          >
            Go
          </button>
        </div>
      </div>

      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-7 gap-y-10 gap-x-4 justify-center mx-auto px-4 sm:px-8"
        style={{ minHeight: "800px" }}
      >
        {loading
          ? Array.from({ length: 25 }).map((_, index) => (
              <SkeletonLoader key={index} />
            ))
          : animes.map((anime, index) => (
              <SmallCard key={index} index={index} data={anime} />
            ))}
      </div>
    </div>
  );
};

export default Genre;