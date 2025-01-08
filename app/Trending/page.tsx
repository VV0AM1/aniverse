"use client";

import NavBar from "@/app/lib/components/NavBar";
import Trending from "@/app/lib/components/Trending";
import { useEffect, useState, useRef } from "react";
import { animeServices } from "@/app/lib/services/animes";

export default function HomePage() {
  const [trendingAnimes, setTrendingAnimes] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchTrendingAnimes = async () => {
    if (loading || !hasMorePages) return;

    setLoading(true);

    try {
      const response = await animeServices.top(currentPage);

      if (response.status === 200) {
        const fetchedAnimes = response.data.data;

        if (fetchedAnimes.length === 0) {
          setHasMorePages(false);
        } else {
          setTrendingAnimes((prevAnimes) => [...prevAnimes, ...fetchedAnimes]);
          setCurrentPage((prevPage) => prevPage + 1);
        }
      } else {
        setHasMorePages(false);
      }
    } catch (error) {
      console.error("Error fetching trending anime data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingAnimes();
  }, [currentPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMorePages && !loading) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMorePages, loading]);

  return (
    <div>
      <NavBar />
      <Trending animes={trendingAnimes} />
      {loading && <p style={{ textAlign: "center", color: "#fff" }}>Loading...</p>}
      <div ref={observerRef} style={{ height: "1px", margin: "10px 0" }}></div>
    </div>
  );
}