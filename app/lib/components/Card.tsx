"use client";

import React from "react";
import Image from "next/image";

export default function Card({
  data,
}: {
  data: {
    title: string;
    episodes: string;
    images: {
      jpg: {
        image_url: string;
        large_image_url: string;
        small_image_url: string;
      };
      webp: {
        image_url: string;
        large_image_url: string;
        small_image_url: string;
      };
    };
    genres: { name: string }[];
    synopsis: string;
    score: string;
    year: string;
  };
}) {
  const genreNames = data.genres
    ? data.genres.map((genre) => genre.name).join(", ")
    : "No genres available";

  return (
    <div className="relative group flex flex-col items-start justify-start">
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

      <div className="absolute top-0 left-0 w-[195px] h-full p-3 bg-black/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-9 overflow-hidden">
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