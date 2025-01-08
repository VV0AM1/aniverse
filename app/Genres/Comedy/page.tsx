"use client";

import NavBar from "@/app/lib/components/NavBar";
import Genre from "@/app/lib/components/Genre";
import { useEffect, useState, useRef } from "react";
import { animeServices } from "@/app/lib/services/animes";

export default function HomePage() {
  const [actionAnimes, setActionAnimes] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [sortCriteria, setSortCriteria] = useState<string>("name"); 
  const fetchedAnimeIds = useRef(new Set<number>());

  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchActionAnimes = async () => {
    if (loading || !hasMorePages) return;

    setLoading(true);

    try {
      const response = await animeServices.all(currentPage);

      if (response.status === 200) {
        const fetchedAnimes = response.data.data;

        const filteredAnimes = fetchedAnimes.filter((anime: any) => {
          const isAction = anime.genres.some((genre: any) => genre.name === "Comedy");
          const isNewAnime = !fetchedAnimeIds.current.has(anime.mal_id);
          if (isAction && isNewAnime) {
            fetchedAnimeIds.current.add(anime.mal_id);
            return true;
          }
          return false;
        });

        setActionAnimes((prevAnimes) => [...prevAnimes, ...filteredAnimes]);

        if (response.data.pagination.has_next_page) {
          setCurrentPage((prevPage) => prevPage + 1);
        } else {
          setHasMorePages(false);
        }
      } else {
        setHasMorePages(false);
      }
    } catch (error) {
      console.error("Error fetching anime data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActionAnimes();
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

  const sortedAnimes = [...actionAnimes].sort((a, b) => {
    if (sortCriteria === "name") {
      return a.title.localeCompare(b.title);
    } else if (sortCriteria === "year-old-new") {
      return (a.year || 0) - (b.year || 0);
    } else if (sortCriteria === "year-new-old") {
      return (b.year || 0) - (a.year || 0);
    } else if (sortCriteria === "score") {
      return (b.score || 0) - (a.score || 0);
    }
    return 0;
  });

  return (
    <div>
      <NavBar />
      <div style={{ display: "flex", width: "150px", height: "100px", textAlign: "center" }}>
        <label htmlFor="sort-select" style={{ marginRight: "10px", color: "#fff" }}>
          Sort by:
        </label>
        <select
          id="sort-select"
          onChange={(e) => setSortCriteria(e.target.value)}
          style={{ padding: "5px", borderRadius: "5px" }}
        >
          <option value="name">Name</option>
          <option value="year-old-new">Year (Old to New)</option>
          <option value="year-new-old">Year (New to Old)</option>
          <option value="score">Score</option>
        </select>
      </div>
      <Genre genre="Comedy" animes={sortedAnimes} />
      {loading && <p style={{ textAlign: "center", color: "#fff" }}>Loading...</p>}
      <div ref={observerRef} style={{ height: "1px", margin: "10px 0" }}></div>
    </div>
  );
}