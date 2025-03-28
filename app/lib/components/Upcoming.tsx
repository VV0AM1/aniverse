"use client";

import React, { useState } from "react";
import SmallCard from "./SmallCard";
import SkeletonLoader from "./Skeleton"; 

interface UpcomingProps {
  animes: any[];
  currentPage: number;
  lastPage: number;
  setCurrentPage: (page: number) => void;
  loading: boolean;
}

const Upcoming: React.FC<UpcomingProps> = ({ animes, currentPage, lastPage, setCurrentPage, loading }) => {
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
    <div className="genre-container flex flex-col">
      <div className="genre-title-container">
        <h1 className="genre-title">Airing Animes</h1>
      </div>

      <div className="navigation-btn flex items-center gap-2">
  <button className="navigation" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
    1
  </button>

  {currentPage > 3 && <p className="dots">...</p>}

  {currentPage > 2 && (
    <button className="navigation" onClick={() => handlePageChange(currentPage - 1)}>
      {currentPage - 1}
    </button>
  )}

  {currentPage !== 1 && currentPage !== lastPage && (
    <button className="navigation current-page" disabled>
      {currentPage}
    </button>
  )}

  {currentPage < lastPage - 1 && (
    <button className="navigation" onClick={() => handlePageChange(currentPage + 1)}>
      {currentPage + 1}
    </button>
  )}

  {currentPage < lastPage - 2 && <p className="dots">...</p>}

  {lastPage > 1 && (
    <button className="navigation" onClick={() => handlePageChange(lastPage)}>
      {lastPage}
    </button>
  )}

  <input
    className="page-input"
    placeholder="Page"
    value={inputPage}
    onChange={(e) => setInputPage(e.target.value)}
    min={1}
    max={lastPage}
  />
  <button className="go-btn" onClick={handleGoToPage}>
    Go
  </button>
</div>

      <div className="genre-item-container grid grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 25 }).map((_, index) => <SkeletonLoader key={index} />) 
          : animes.map((anime, index) => <SmallCard key={index} index={index} data={anime} />)}
      </div>
    </div>
  );
};

export default Upcoming;