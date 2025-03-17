'use client'

import NavBar from "./lib/components/NavBar";
import Card from "./lib/components/Card";
import "./globals.css";
import Home from "./lib/components/Home";
import Karusel from "./lib/components/Karusel";
import TopSection from "./lib/components/TopSection";
import { useEffect, useState } from "react";
import { animeServices } from "./lib/services/animes";

export default function HomePage() {
  const [animes, setAnimes] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [upcomingAnimes, setUpcomingAnimes] = useState<any[]>([]);
  const [airingAnimes, setAiringAnimes] = useState<any[]>([]);
  const [topCharacters, setTopCharacters] = useState<any[]>([]);
  const [topManga, setTopManga] = useState<any[]>([]);


  useEffect(() => {
    const getAllAnimes = async () => {
      try {
        setLoading(true);

        const response = await animeServices.top();

        if (response.status === 200) {
          const animeData = response.data.data;

          if (animeData.length === 0) {
            setHasMore(false);
          }

          setAnimes((prevAnimes) => [...prevAnimes, ...animeData]);
        }

        setTimeout(async () => {
          try {
            const upcomingResponse = await animeServices.getAnimeUpcoming();
            setUpcomingAnimes(upcomingResponse.data.data);
          } catch (error) {
            console.error('Error fetching upcoming anime data:', error);
          }

          setTimeout(async () => {
            try {
              const airingResponse = await animeServices.getAnimeAiring();
              setAiringAnimes(airingResponse.data.data);
            } catch (error) {
              console.error('Error fetching airing anime data:', error);
            }

            setTimeout(async () => {
              try {
                const topCharResponse = await animeServices.getTopCharacters();
                setTopCharacters(topCharResponse.data.data);
              } catch (error) {
                console.error('Error fetching top characters data:', error);
              }
              setTimeout(async () => {
                try {
                  const topMangaResponse = await animeServices.getTopManga();
                  setTopManga(topMangaResponse.data.data);
                } catch (error) {
                  console.error('Error fetching top characters data:', error);
                }
              }, 1000);
            }, 1000);
          }, 1000);
        }, 1000);
      } catch (error) {
        console.error('Error fetching anime data:', error);
      } finally {
        setLoading(false);
      }
    };

    getAllAnimes();
  }, [page]);

  return (
    <div className="flex flex-col">
      <div>
        <NavBar />
        <Home children={undefined} />
        <Karusel animes={animes} />
      </div>
      <div>
        <TopSection upcomingAnimes={upcomingAnimes} airingAnimes={airingAnimes} topCharacters={topCharacters} topManga={topManga}/>
      </div>
    </div>
  );
}