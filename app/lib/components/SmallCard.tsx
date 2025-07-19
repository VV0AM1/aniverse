"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SmallCard({ data, index }: { data: any; index: number }) {
  const router = useRouter();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const movedRef = useRef(false);

  const japaneseTitle = data.titles?.find((t: any) => t.type === "Japanese")?.title || "N/A";
  const isPopupLeft = index % 5 > 2;

  const formatRating = (rating?: string) => {
    if (!rating) return "14+";
    return rating.replace(/(-.{3}).*/, "$1");
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      console.log("Window resized. Is mobile?", mobile);
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isPopupVisible && !isMobile) {
      const hideTimer = setTimeout(() => {
        console.log("Auto-hiding desktop popup");
        setIsPopupVisible(false);
      }, 5000);
      return () => clearTimeout(hideTimer);
    }
  }, [isPopupVisible, isMobile]);

  const handleRedirect = () => {
    if ("episodes" in data && typeof data.episodes !== "undefined") {
      router.push(`/animes/${data.mal_id}`);
    } else if ("chapters" in data && typeof data.chapters !== "undefined") {
      router.push(`/mangas/${data.mal_id}`);
    }
  };

  const handleTouchStart = () => {
    console.log("Touch start");
    movedRef.current = false;
    timerRef.current = setTimeout(() => {
      console.log("Long press detected: showing popup");
      setIsPopupVisible(true);
    }, 600);
  };

  const handleTouchMove = () => {
    movedRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!movedRef.current && !isPopupVisible) {
      console.log("Quick tap: navigating");
      handleRedirect();
    }
  };

  const handleTouchCancel = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <>
      <div
        className="relative cursor-pointer w-[140px] h-[230px] sm:w-[180px] sm:h-[300px] rounded-lg overflow-visible group touch-manipulation"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        onClick={(e) => {
          if (window.innerWidth > 768) {
            console.log("Desktop click: redirecting");
            handleRedirect();
          }
        }}
      >
        <div className="w-full h-[80%] relative overflow-hidden rounded-lg">
          <Image
            src={data?.images?.jpg?.image_url}
            alt={data.title}
            fill
            className="object-cover rounded-lg transition-all duration-300 ease-in-out group-hover:blur-[2px] group-hover:brightness-75"
          />
          <img
            src="/img/player-big.svg"
            alt="Play"
            className="absolute top-1/2 left-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>

        <div className="p-2 text-white text-xs">
          <h2 className="truncate font-medium">{data.title}</h2>
          <div className="flex justify-between text-gray-400 text-[11px] mt-1">
            <span>{data.duration?.replace(" per ep", "") || `${data.volumes} vol`}</span>
            <span>{data.type}</span>
          </div>
        </div>

        {!isMobile && (
          <div
            className={`absolute top-0 ${isPopupLeft ? "right-full mr-4" : "left-full ml-4"} z-50 
              w-[360px] max-w-[90vw] h-[300px] p-4 bg-[#1b1b1b]/90 backdrop-blur-md rounded-xl text-white shadow-lg
              transition-all duration-300 ease-in-out flex-col ${
                isPopupVisible
                  ? "opacity-100 scale-100 pointer-events-auto flex"
                  : "opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto group-hover:flex"
              }`}
          >
            <h2 className="text-md font-semibold mb-1 line-clamp-2">{data.title}</h2>
            <p className="text-gray-300 text-sm mb-2">
              {data.episodes ? `${data.episodes} Episodes` : `${data.chapters} Chapters`} | {data.year}
            </p>

            <div className="flex flex-wrap gap-2 text-[13px] mb-3">
              <span className="bg-sky-600 px-2 py-1 rounded flex items-center gap-1">
                <img src="/img/star.svg" className="w-3 h-3" /> {data.score}
              </span>
              <span className="bg-lime-600 px-2 py-1 rounded">{formatRating(data.rating)}</span>
              <span className="bg-white text-black px-2 py-1 rounded flex items-center gap-1">
                <img src="/img/medal.svg" className="w-3 h-3" /> {data.rank}
              </span>
              <span className="bg-emerald-600 text-white px-2 py-1 rounded flex items-center gap-1">
                <img src="/img/heart.svg" className="w-3 h-3" /> {data.popularity}
              </span>
              <span className="bg-yellow-600 text-white px-2 py-1 rounded flex items-center gap-1">
                <img src="/img/eye.svg" className="w-3 h-3" /> {data.members}
              </span>
            </div>

            <p className="line-clamp-3 text-gray-200">{data.synopsis}</p>

            <div className="mt-2 text-sm space-y-1">
              <p><b>Japanese:</b> {japaneseTitle}</p>
              <p><b>Aired:</b> {data.aired?.string?.split(" to ")[0] || data.published?.string}</p>
              <p><b>Status:</b> {data.status}</p>
            </div>

            {data.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {data.genres.map((genre: any) => (
                  <span
                    key={genre.name}
                    className="px-2 py-1 text-[13px] bg-[#2e2e2e] text-white rounded-full border border-white/10"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {isPopupVisible && isMobile && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm p-4 flex justify-center items-center">
          <div className="bg-[#1b1b1b] max-w-md w-full rounded-lg p-4 text-white shadow-xl overflow-y-auto max-h-[80vh]">
            <h2 className="text-lg font-semibold mb-2">{data.title}</h2>
            <p className="text-sm text-gray-400 mb-2">
              {data.episodes ? `${data.episodes} Episodes` : `${data.chapters} Chapters`} | {data.year}
            </p>

            <div className="flex flex-wrap gap-2 text-xs mb-3">
              <span className="bg-sky-600 px-2 py-1 rounded flex items-center gap-1">
                <img src="/img/star.svg" className="w-3 h-3" /> {data.score}
              </span>
              <span className="bg-lime-600 px-2 py-1 rounded">{formatRating(data.rating)}</span>
              <span className="bg-white text-black px-2 py-1 rounded flex items-center gap-1">
                <img src="/img/medal.svg" className="w-3 h-3" /> {data.rank}
              </span>
              <span className="bg-emerald-600 text-white px-2 py-1 rounded flex items-center gap-1">
                <img src="/img/heart.svg" className="w-3 h-3" /> {data.popularity}
              </span>
              <span className="bg-yellow-600 text-white px-2 py-1 rounded flex items-center gap-1">
                <img src="/img/eye.svg" className="w-3 h-3" /> {data.members}
              </span>
            </div>

            <p className="line-clamp-5 text-gray-300 text-sm">{data.synopsis}</p>

            <div className="mt-3 text-sm space-y-1">
              <p><b>Japanese:</b> {japaneseTitle}</p>
              <p><b>Aired:</b> {data.aired?.string?.split(" to ")[0] || data.published?.string}</p>
              <p><b>Status:</b> {data.status}</p>
            </div>

            {data.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {data.genres.map((genre: any) => (
                  <span
                    key={genre.name}
                    className="px-2 py-1 text-xs bg-[#2e2e2e] text-white rounded-full border border-white/10"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <button
              className="mt-4 w-full bg-purple-600 py-2 rounded-lg text-sm font-medium"
              onClick={() => {
                setIsPopupVisible(false);
                handleRedirect();
              }}
            >
              Go to Anime Page
            </button>
          </div>
        </div>
      )}
    </>
  );
}