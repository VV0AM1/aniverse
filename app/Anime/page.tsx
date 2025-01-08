"use client";

import NavBar from "@/app/lib/components/NavBar";
import Anime from "@/app/lib/components/Anime";
import { useEffect, useState, useRef } from "react";
import { animeServices } from "@/app/lib/services/animes";
import { useRouter } from 'next/navigation';


export default function HomePage() {
    const [animes, setAnimes] = useState<any[]>([]);
    const [page, setPage] = useState(1); 
    const [loading, setLoading] = useState(false); 
    const [hasMore, setHasMore] = useState(true); 
  


    useEffect(() => {
      const getAllAnimes = async (page: number) => {
        if (loading || !hasMore) return; 
  
        setLoading(true);
  
        try {
          const response = await animeServices.all();
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
      <Anime />
    </div>
  );
}