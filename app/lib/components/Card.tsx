"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Card({ data }: {
  data: {
    mal_id: string;
    title: string;
    episodes: string;
    images: {
      jpg: { image_url: string };
    };
    genres: { name: string }[];
    synopsis: string;
    score: string;
    year: string;
  };
}) {
  const [isMobileOverlayVisible, setIsMobileOverlayVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const movedRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (isMobileOverlayVisible) {
      const hideTimer = setTimeout(() => setIsMobileOverlayVisible(false), 5000);
      return () => clearTimeout(hideTimer);
    }
  }, [isMobileOverlayVisible]);

  const handleTouchStart = () => {
    movedRef.current = false;
    timerRef.current = setTimeout(() => setIsMobileOverlayVisible(true), 600);
  };

  const handleTouchMove = () => {
    movedRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!movedRef.current && !isMobileOverlayVisible) {
      router.push(`/animes/${data.mal_id}`);
    }
  };

  const handleTouchCancel = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleClick = () => {
    router.push(`/animes/${data.mal_id}`);
  };

  const genreNames = data.genres?.map((g) => g.name).join(", ") || "No genres available";

  return (
    <div
      className="relative group flex flex-col items-start justify-start cursor-pointer"
      onClick={handleClick} 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      <Image
        src={data.images.jpg.image_url}
        width={195}
        height={330}
        alt={data.title}
        className="rounded-lg w-[195px] h-[330px] object-cover brightness-75 group-hover:brightness-50 transition duration-300"
      />

      <div className="mt-2 w-[195px]">
        <h2 className="text-white font-semibold text-sm truncate">{data.title}</h2>
        <p className="text-gray-400 text-xs">{data.episodes} EP</p>
      </div>

      <div
        className={`absolute top-0 left-0 w-[195px] h-full p-3 bg-black/80 rounded-lg
        ${isMobileOverlayVisible ? "opacity-100 pointer-events-auto" : "opacity-0 group-hover:opacity-100"}
        transition-opacity duration-300 z-10 overflow-hidden
        group-hover:pointer-events-none`} 
      >
        <h2 className="text-white font-semibold text-sm mb-1">{data.title}</h2>
        <p className="text-gray-400 text-xs">{data.episodes} EP</p>
        <p className="text-gray-400 text-xs">Year: {data.year}</p>
        <p className="text-gray-400 text-xs mb-1">Rating: {data.score}</p>
        <p className="text-white text-[13px] line-clamp-6 mb-2">{data.synopsis}</p>
        <p className="text-gray-400 text-xs leading-snug">
          <span className="font-semibold text-white">Genre:</span> {genreNames}
        </p>
      </div>
    </div>
  );
}