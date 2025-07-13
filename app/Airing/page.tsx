"use client";

import NavBar from "@/app/lib/components/NavBar";
import Airing from "@/app/lib/components/Airing";
import { useEffect, useState } from "react";
import { animeServices } from "@/app/lib/services/animes";
import Footer from "../lib/components/Footer";

export default function HomePage() {
  const [airingAnimes, setAiringAnimes] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAiringAnimes = async (page: number) => {
    setLoading(true);
    setError(null);
  
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
  
      const response = await animeServices.getAnimeAiring(page);
      if (response.status === 200) {
        setAiringAnimes(response.data.data);
        setLastPage(response.data.pagination.last_visible_page);
      } else {
        setError("Failed to fetch trending animes.");
      }
    } catch (error) {
      console.error("Error fetching trending anime data:", error);
      setError("Failed to fetch trending animes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAiringAnimes(currentPage);
  }, [currentPage]);

  return (
    <div>
      <NavBar />
      {error ? (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      ) : (
        <Airing 
          animes={airingAnimes} 
          currentPage={currentPage} 
          lastPage={lastPage} 
          setCurrentPage={setCurrentPage} 
          loading={loading} 
        />
      )}
      {loading && <p style={{ textAlign: "center", color: "#fff" }}>Loading...</p>}
      <Footer></Footer>
    </div>
  );
}