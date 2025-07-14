"use client";

import Upcoming from "@/app/lib/components/Upcoming";
import { useEffect, useState } from "react";
import { animeServices } from "@/app/lib/services/animes";

export default function HomePage() {
  const [upcomingAnimes, setUpcomingAnimes] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUpcomingAnimes = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await animeServices.getAnimeUpcoming(page);
      if (response.status === 200) {
        setUpcomingAnimes(response.data.data);
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
    fetchUpcomingAnimes(currentPage);
  }, [currentPage]);

  return (
    <div>
      {error ? (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      ) : (
        <Upcoming 
          animes={upcomingAnimes} 
          currentPage={currentPage} 
          lastPage={lastPage} 
          setCurrentPage={setCurrentPage} 
          loading={loading} 
        />
      )}
    </div>
  );
}