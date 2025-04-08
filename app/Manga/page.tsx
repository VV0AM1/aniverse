"use client";

import NavBar from "@/app/lib/components/NavBar";
import Manga from "@/app/lib/components/Manga";
import { useEffect, useState } from "react";
import { animeServices } from "@/app/lib/services/animes";

export default function HomePage() {
  const [manga, setMangas] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchManga = async (page: number) => {
    setLoading(true);
    setError(null);
  
    try {
      // Delay for 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
  
      const response = await animeServices.geManga(page);
      if (response.status === 200) {
        setMangas(response.data.data);
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
    fetchManga(currentPage);
  }, [currentPage]);

  return (
    <div>
      <NavBar />
      {error ? (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      ) : (
        <Manga 
          animes={manga} 
          currentPage={currentPage} 
          lastPage={lastPage} 
          setCurrentPage={setCurrentPage} 
          loading={loading} 
        />
      )}
      {loading && <p style={{ textAlign: "center", color: "#fff" }}>Loading...</p>}
    </div>
  );
}