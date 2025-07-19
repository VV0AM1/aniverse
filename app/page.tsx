'use client';

import { useEffect, useState } from "react";
import NavBar from "./lib/components/NavBar";
import Home from "./lib/components/Home";
import Karusel from "./lib/components/Karusel";
import KaruselSeasonal from "./lib/components/KaruselSeasonal";
import TopSection from "./lib/components/TopSection";
import Socials from "./lib/components/Socials";
import WebReview from "./lib/components/WebReview";
import Footer from "./lib/components/Footer";
import { animeServices } from "./lib/services/animes";
import "./globals.css";

export default function HomePage() {
  const [animes, setAnimes] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    if (storedNickname) {
      setNickname(storedNickname);
    }
  }, []);

  useEffect(() => {
    const getTopAnime = async () => {
      try {
        setLoading(true);
        const response = await animeServices.top();

        if (response.status === 200) {
          const animeData = response.data.data;
          if (animeData.length === 0) {
            setHasMore(false);
          }

          setAnimes((prev) => [...prev, ...animeData]);
        }
      } catch (error) {
        console.error("Error fetching top anime:", error);
      } finally {
        setLoading(false);
      }
    };

    getTopAnime();
  }, [page]);

  return (
    <div className="flex flex-col">
      <NavBar />
      <Home children={undefined} />
      <div className="h-[80vh]" />

      <Karusel animes={animes} />
      <TopSection />
      <div className="mt-[-8vh] w-full">
        <Socials />
      </div>
      <KaruselSeasonal animes={animes} />
      <WebReview />
      <div className="home-footer-container mt-2">
        <Footer />
      </div>
    </div>
  );
}