"use client";
import { useEffect, useState } from "react";
import NavBar from "@/app/lib/components/NavBar";
import Genre from "@/app/lib/components/Genre";
import { animeServices } from "@/app/lib/services/animes";
import { usePathname } from "next/navigation";

const GenrePage = () => {
  const pathname = usePathname();
  const genre = pathname?.split("/")[2]; 

  const [animes, setAnimes] = useState<any[]>([]);
  const [lastPages, setLastPages] = useState<number>(1);
  const [currentPages, setCurrentPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!genre) return;

    const fetchAnimesByGenre = async () => {
      try {
        setLoading(true);

        const genreResponse = await animeServices.getAnimeGenres();
        await new Promise((resolve) => setTimeout(resolve, 1000)); 
        const matchedGenre = genreResponse.data.data.find(
          (g: any) => g.name.toLowerCase() === genre.toLowerCase()
        );
        if (!matchedGenre) {
          setError(`Genre '${genre}' not found.`);
          return;
        }

        const genreId = matchedGenre.mal_id;
        const animeResponse = await animeServices.getGenreAnimes(genreId, currentPages);
        await new Promise((resolve) => setTimeout(resolve, 1000)); 


        setLastPages(animeResponse.data.pagination.last_visible_page);
        setAnimes(animeResponse.data.data);
      } catch (err: any) {
        console.error("Error fetching animes:", err);
        setError("Failed to fetch animes.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnimesByGenre();
  }, [genre, currentPages, lastPages]);



  return (
    <div>
      <NavBar />
        <Genre 
          genre={genre as string} 
          animes={animes} 
          currentPages={currentPages} 
          lastPages={lastPages} 
          setCurrentPages={setCurrentPages} 
          loading={loading}  
        />
    </div>
  );
};

export default GenrePage;
