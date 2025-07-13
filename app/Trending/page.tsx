"use client";

import NavBar from "@/app/lib/components/NavBar";
import Trending from "@/app/lib/components/Trending";
import { useEffect, useState } from "react";
import { animeServices } from "@/app/lib/services/animes";
import Footer from "../lib/components/Footer";

export default function HomePage() {
  const [trendingAnimes, setTrendingAnimes] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrendingAnimes = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await animeServices.top(page);
      if (response.status === 200) {
        setTrendingAnimes(response.data.data);
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
    fetchTrendingAnimes(currentPage);
  }, [currentPage]);

  return (
    <div>
      <NavBar />
      {error ? (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      ) : (
        <Trending 
          animes={trendingAnimes} 
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