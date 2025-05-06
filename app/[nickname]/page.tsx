'use client'

import NavBar from "@/app/lib/components/NavBar";
import Card from "@/app/lib/components/Card";
import "@/app/globals.css";
import Home from "@/app/lib/components/Home";
import Karusel from "@/app/lib/components/Karusel";
import KaruselSeasonal from "@/app/lib/components/KaruselSeasonal";
import TopSection from "@/app/lib/components/TopSection";
import Socials from "@/app/lib/components/Socials";

import { useEffect, useState } from "react";
import { animeServices } from "@/app/lib/services/animes";

import { useParams } from 'next/navigation';

import React from "react";
import { notFound } from "next/navigation";



export default function HomePage() {
  const [animes, setAnimes] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [upcomingAnimes, setUpcomingAnimes] = useState<any[]>([]);
  const [airingAnimes, setAiringAnimes] = useState<any[]>([]);
  const [topCharacters, setTopCharacters] = useState<any[]>([]);
  const [topManga, setTopManga] = useState<any[]>([]);

  const params = useParams();
  const nicknameParam = typeof params?.nickname === 'string' ? params.nickname : '';
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    const storedNickname = localStorage.getItem('nickname');

    if (storedNickname && storedNickname === nicknameParam) {
      setNickname(storedNickname);
    } else {
      setNickname(null); 
    }
  }, [nicknameParam]);


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
        <div className="social-compoent-container w-full">
          <Socials />
        </div>
        <KaruselSeasonal animes={animes} />
    </div>
  );
}