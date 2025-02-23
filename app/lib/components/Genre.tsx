"use client";

import React, { useState } from "react";
import SmallCard from "./SmallCard";
import SkeletonLoader from "./Skeleton";


interface GenreProps {
  genre: string;
  animes: any[];
  currentPages: number;
  lastPages: number;
  setCurrentPages: (page: number) => void;
  loading: boolean; 

}

const Genre: React.FC<GenreProps> = ({ genre, animes, currentPages, lastPages, setCurrentPages, loading}) => {
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
    <div className="genre-container flex flex-col">
      <div className="genre-title-container">
        <h1 className="genre-title">{genre} Animes</h1>
      </div>

      <div className="navigation-btn flex items-center gap-2">
  <button className="navigation" onClick={() => handlePageChange(1)} disabled={currentPages === 1}>
    1
  </button>

  {currentPages > 3 && <p className="dots">...</p>}

  {currentPages > 2 && (
    <button className="navigation" onClick={() => handlePageChange(currentPages - 1)}>
      {currentPages - 1}
    </button>
  )}

  {currentPages !== 1 && currentPages !== lastPages && (
    <button className="navigation current-page" disabled>
      {currentPages}
    </button>
  )}

  {currentPages < lastPages - 1 && (
    <button className="navigation" onClick={() => handlePageChange(currentPages + 1)}>
      {currentPages + 1}
    </button>
  )}

  {currentPages < lastPages - 2 && <p className="dots">...</p>}

  {lastPages > 1 && (
    <button className="navigation" onClick={() => handlePageChange(lastPages)}>
      {lastPages}
    </button>
  )}

  <input
    className="page-input"
    placeholder="Page"
    value={inputPage}
    onChange={(e) => setInputPage(e.target.value)}
    min={1}
    max={lastPages}
  />
  <button className="go-btn" onClick={handleGoToPage}>
    Go
  </button>
</div>

      <div className="genre-item-container grid grid-cols-5 gap-2">
        {loading
        ? Array.from({ length: 25 }).map((_, index) => <SkeletonLoader key={index} />)
        : animes.map((anime, index) => <SmallCard key={index} data={anime} />)}
      </div>
    </div>
  );
};

export default Genre;