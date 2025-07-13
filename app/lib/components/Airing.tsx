"use client";

import React, { useState } from "react";
import SmallCard from "./SmallCard";
import SkeletonLoader from "./Skeleton";

interface AiringProps {
  animes: any[];
  currentPage: number;
  lastPage: number;
  setCurrentPage: (page: number) => void;
  loading: boolean;
}

const Airing: React.FC<AiringProps> = ({
  animes,
  currentPage,
  lastPage,
  setCurrentPage,
  loading,
}) => {
  const [inputPage, setInputPage] = useState<number | string>("");

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  };

  const handleGoToPage = () => {
    const pageNumber = Number(inputPage);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= lastPage) {
      setCurrentPage(pageNumber);
      setInputPage("");
    }
  };

  return (
    <div className="flex flex-col px-4 sm:px-10 py-8 text-white mb-6">
      {/* Title + Pagination */}
      <div className="w-full flex flex-col items-center gap-4 mb-8 px-4 mt-[100px]">
        <h1 className="text-3xl sm:text-4xl font-semibold text-white text-center">
          Airing Animes
        </h1>

        <div className="flex flex-wrap justify-center items-center gap-2 text-sm sm:text-base">
          <button
            className="px-3 py-1 rounded bg-[#1f1f1f] text-white hover:bg-purple-600 transition"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            1
          </button>

          {currentPage > 3 && <p className="text-gray-400">...</p>}

          {currentPage > 2 && (
            <button
              className="px-3 py-1 rounded bg-[#1f1f1f] text-white hover:bg-purple-600 transition"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              {currentPage - 1}
            </button>
          )}

          {currentPage !== 1 && currentPage !== lastPage && (
            <button className="px-3 py-1 rounded bg-purple-600 text-white font-semibold cursor-default">
              {currentPage}
            </button>
          )}

          {currentPage < lastPage - 1 && (
            <button
              className="px-3 py-1 rounded bg-[#1f1f1f] text-white hover:bg-purple-600 transition"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              {currentPage + 1}
            </button>
          )}

          {currentPage < lastPage - 2 && <p className="text-gray-400">...</p>}

          {lastPage > 1 && (
            <button
              className="px-3 py-1 rounded bg-[#1f1f1f] text-white hover:bg-purple-600 transition"
              onClick={() => handlePageChange(lastPage)}
            >
              {lastPage}
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

      {/* Anime Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-7 gap-y-6 gap-x-4 justify-center mx-auto px-4 sm:px-8">
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

export default Airing;