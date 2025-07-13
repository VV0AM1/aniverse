'use client';

import { useEffect, useState } from "react";
import { animeServices } from "@/app/lib/services/animes";
import TopSkeletonLoader from "./TopSkeletonLoader";
import TopCard from "./TopCard";

const TopSection = () => {
  const [upcomingAnimes, setUpcomingAnimes] = useState<any[]>([]);
  const [airingAnimes, setAiringAnimes] = useState<any[]>([]);
  const [topCharacters, setTopCharacters] = useState<any[]>([]);
  const [topManga, setTopManga] = useState<any[]>([]);

  const [loadingStates, setLoadingStates] = useState({
    upcoming: true,
    airing: true,
    characters: true,
    manga: true,
  });

  useEffect(() => {
    const fetchSequentially = async () => {
      try {
        // 1. Fetch upcoming
        const upcomingRes = await animeServices.getAnimeUpcoming();
        await new Promise((res) => setTimeout(res, 2000));
        setUpcomingAnimes(upcomingRes.data.data);
        setLoadingStates(prev => ({ ...prev, upcoming: false }));

        // 2. Fetch airing
        const airingRes = await animeServices.getAnimeAiring();
        await new Promise((res) => setTimeout(res, 2000));
        setAiringAnimes(airingRes.data.data);
        setLoadingStates(prev => ({ ...prev, airing: false }));

        // 3. Fetch characters
        const charactersRes = await animeServices.getTopCharacters();
        await new Promise((res) => setTimeout(res, 2000));
        setTopCharacters(charactersRes.data.data);
        setLoadingStates(prev => ({ ...prev, characters: false }));

        // 4. Fetch manga
        const mangaRes = await animeServices.getTopManga();
        await new Promise((res) => setTimeout(res, 2000));
        setTopManga(mangaRes.data.data);
        setLoadingStates(prev => ({ ...prev, manga: false }));
      } catch (error) {
        console.error("Sequential fetch error in TopSection:", error);
      }
    };

    fetchSequentially();
  }, []);

  const renderColumn = (title: string, data: any[], loading: boolean) => (
    <div className="flex flex-col w-full sm:w-1/2 lg:w-1/4 px-2 sm:px-4 pr-4 border-r border-[#2a2a2a]">
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">{title}</h2>
      {loading
        ? [...Array(5)].map((_, index) => <TopSkeletonLoader key={index} />)
        : data.slice(0, 5).map((item, index) => (
            <TopCard key={index} data={item} index={index} />
          ))}
    </div>
  );

  return (
    <section className="w-full bg-[#0d0e12]/90 backdrop-blur-md text-white relative z-10 py-16 px-4 sm:px-12">
      <div className="w-full flex flex-wrap justify-start gap-y-14">
        {renderColumn("Top Upcoming", upcomingAnimes, loadingStates.upcoming)}
        {renderColumn("Top Airing", airingAnimes, loadingStates.airing)}
        {renderColumn("Favorite Characters", topCharacters, loadingStates.characters)}
        {renderColumn("Favorite Manga", topManga, loadingStates.manga)}
      </div>
    </section>
  );
};

export default TopSection;