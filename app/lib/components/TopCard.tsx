"use client";

import Image from "next/image";
import TopSkeletonLoader from "./TopSkeletonLoader";
import { useRouter } from "next/navigation";

export default function TopCard({
  data,
  index,
}: {
  data: {
    mal_id: string;
    title_english?: string;
    name?: string;
    chapters?: string;
    favorites?: string;
    score: string;
    nicknames?: string;
    episodes?: string;
    anime?: {
      role: string;
      anime: {
        mal_id: number;
        title: string;
        images: {
          jpg: { image_url: string; small_image_url: string };
        };
      };
    }[];
    images: {
      jpg: { image_url: string };
      webp: { image_url: string };
    };
  };
  index: number;
}) {
  const router = useRouter();

  if (!data) return <TopSkeletonLoader />;

  const handleRedirect = () => {
    if ("episodes" in data && typeof data.episodes !== "undefined") {
      router.push(`/animes/${data.mal_id}`);
    } else if ("chapters" in data && typeof data.chapters !== "undefined") {
      router.push(`/mangas/${data.mal_id}`);
    } else if (
      "anime" in data &&
      Array.isArray(data.anime) &&
      data.anime.length > 0 &&
      "mal_id" in data.anime[0].anime
    ) {
      const animeId = data.anime[0].anime.mal_id;
      router.push(`/characters/${data.mal_id}?featuredAnime=${animeId}`);
    }
  };

  return (
  <div
    onClick={handleRedirect}
    className="flex items-start gap-4 py-3 cursor-pointer hover:bg-[#1f1f1f] transition rounded-lg border-b border-[#2a2a2a] last:border-none"
  >
    <Image
      src={data?.images?.jpg.image_url}
      alt={data.title_english || data.name || "Unknown"}
      width={100}
      height={160}
      className="rounded-md w-20 h-28 object-cover"
    />
    <div className="flex flex-col gap-1 w-full">
      <h3 className="text-lg text-white font-medium line-clamp-2">
        {data.title_english || data.name}
      </h3>
      <div className="flex gap-2 mt-1">
        <span className="text-[16px] px-2 py-[2px] bg-yellow-300 text-black rounded font-semibold">
          CC: {data.episodes ? `${data.episodes} EP` : data.chapters ? `${data.chapters} CH` : "??"}
        </span>
        <span className="text-[16px] px-2 py-[2px] bg-purple-600 text-white rounded font-semibold flex items-center gap-1">
          <img src="/img/small-start.svg" alt="star" className="w-5 h-5" />
          {data.score || data.favorites}
        </span>
      </div>
    </div>
  </div>
);
}