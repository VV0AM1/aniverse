'use client'

import NavBar from "./lib/components/NavBar";
import Card from "./lib/components/Card";
import "./globals.css";
import Home from "./lib/components/Home";
import Karusel from "./lib/components/Karusel";
import { useEffect, useState } from "react";
import { animeServices } from "./lib/services/animes";

export default function HomePage() {
  const [animes, setAnimes] = useState<any[]>([]);
  const [page, setPage] = useState(0); 
  const [loading, setLoading] = useState(false); 
  const [hasMore, setHasMore] = useState(true); 

  useEffect(() => {
    const getAllAnimes = async (page: number) => {
      if (loading || !hasMore) return; 

      setLoading(true);

      try {
        const response = await animeServices.top();
        console.log("This is response", response);

        if (response.status === 200) {
          const animeData = response.data.data;

          if (animeData.length === 0) {
            setHasMore(false); 
          }

          setAnimes((prevAnimes) => [...prevAnimes, ...animeData]);
        }
      } catch (error) {
        console.error('Error fetching anime data:', error);
      } finally {
        setLoading(false);
      }
    };

    getAllAnimes(page); 
  }, [page]); 



  return (
    <div>
      <NavBar />
      <Home children={undefined} />
      <Karusel animes={animes} />
    </div>
  );
}