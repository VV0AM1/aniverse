"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { animeServices } from "@/app/lib/services/animes";
import Image from "next/image";
import Character from "./Character";
import Review, { ReviewHandle } from "./Review";
import Socials from "./Socials";
import AnimeRecomendation from "./AnimeRecomendations";
import FullPageLoader from "@/app/lib/components/FullPageLoader";

export default function Anime() {
  const { mal_id } = useParams();
  const [animeData, setAnimeData] = useState<any>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userActions, setUserActions] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const reviewRef = useRef<ReviewHandle>(null);

  const animeId = String(mal_id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const animeRes = await animeServices.getByIdFull(animeId);
        setAnimeData(animeRes.data.data);
      } catch (error) {
        console.error("Error fetching anime details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (mal_id && !Array.isArray(mal_id)) fetchData();
  }, [animeId]);

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    const storedToken = localStorage.getItem("token");
    if (storedNickname) setNickname(storedNickname);
    if (storedToken) setToken(storedToken);
  }, []);

  const showToast = (message: string) => {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.className =
      "fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow-lg z-[9999] transition-all duration-500 opacity-0";
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.add("opacity-100");
    });
    setTimeout(() => {
      toast.classList.remove("opacity-100");
      setTimeout(() => document.body.removeChild(toast), 500);
    }, 2500);
  };

  const handleAnimeAction = async (actionType: string) => {
    if (!nickname || !token) {
      alert("You're not logged in!");
      return;
    }

    const alreadyActive = userActions[actionType];

    try {
      const res = await fetch("/api/anime/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nickname,
          animeId,
          action: actionType,
          remove: alreadyActive,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to update");

      setUserActions((prev) => ({
        ...prev,
        [actionType]: !alreadyActive,
      }));

      showToast(
        `${alreadyActive ? "❌ Removed from" : "✅ Added to"} ${
          actionType.charAt(0).toUpperCase() + actionType.slice(1)
        }`
      );
    } catch (error: any) {
      console.error("Error updating anime status:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  if (loading || !animeData) return <FullPageLoader />;

  return (
    <div className="w-full text-white">
      <div
        className="relative w-full py-12 px-4 bg-cover bg-center pt-[120px]"
        style={{ backgroundImage: "url('/img/back-amime.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row gap-6 px-4 md:px-8">
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <Image
              src={animeData?.images?.jpg?.image_url}
              width={180}
              height={260}
              alt={animeData.title}
              className="rounded-lg object-cover w-[180px] h-[260px]"
            />
          </div>

          <div className="flex flex-col gap-3 text-white max-w-4xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-purple-300">
              {animeData.title}
            </h1>

            <div className="flex gap-2 flex-wrap text-xs sm:text-sm">
              <span className="bg-gray-800 px-2 py-1 rounded-md flex items-center gap-1">
                ⭐ {animeData.score}
              </span>
              <span className="bg-gray-800 px-2 py-1 rounded-md">
                {animeData.duration || `${animeData.volumes} per chapter`}
              </span>
              <span className="bg-gray-800 px-2 py-1 rounded-md">
                {animeData.episodes
                  ? `${animeData.episodes} Episodes`
                  : `${animeData.chapters} Chapters`}
              </span>
              <span className="bg-gray-800 px-2 py-1 rounded-md">
                {animeData.type}
              </span>
              <span className="bg-gray-800 px-2 py-1 rounded-md flex items-center gap-1">
                ❤️ {animeData.members}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {animeData.trailer?.url && (
                <a
                  href={animeData.trailer?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-white text-sm"
                >
                  ▶ Watch Trailer
                </a>
              )}

              {["bookmark", "later", "liked", "watched"].map((action) => {
                const isActive = userActions[action];
                return (
                  <button
                    key={action}
                    onClick={() => handleAnimeAction(action)}
                    className={`px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-green-600 text-white"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    {isActive
                      ? `${action.charAt(0).toUpperCase() + action.slice(1)} ✓`
                      : action.charAt(0).toUpperCase() + action.slice(1)}
                  </button>
                );
              })}
            </div>

            <p className="text-gray-200 text-sm mt-2 line-clamp-5 md:line-clamp-none">
              {animeData.synopsis}
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              {animeData.genres?.map((genre: any) => (
                <span
                  key={genre.mal_id}
                  className="bg-[#1D0D39] text-xs px-2 py-1 rounded-md"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <Character mal_id={animeId} />
      </div>

      <div className="w-[90vw] mx-auto px-4 mt-10">
        {reviewRef.current && (
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl md:text-3xl font-semibold">Reviews</h2>
            <div className="flex gap-2">
              <button
                onClick={() => reviewRef.current?.scrollLeft()}
                className="text-lg px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600"
              >
                {"<"}
              </button>
              <button
                onClick={() => reviewRef.current?.scrollRight()}
                className="text-lg px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600"
              >
                {">"}
              </button>
            </div>
          </div>
        )}

        <div className="overflow-hidden w-full">
          <Review ref={reviewRef} mal_id={animeId} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-10">
        <AnimeRecomendation mal_id={animeId} />
      </div>

      <div className="mt-10">
        <Socials />
      </div>
    </div>
  );
}