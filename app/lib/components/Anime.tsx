"use client";
import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { animeServices } from "@/app/lib/services/animes";
import Character from "./Character";
import { relative } from "path";

const Anime = () => {
  const searchParams = useSearchParams();

  const title = searchParams.get("title");
  const episodes = searchParams.get("episodes");
  const image_url = searchParams.get("image_url");
  const synopsis = searchParams.get("synopsis");
  const score = searchParams.get("score");
  const year = searchParams.get("year");
  const genres = searchParams.get("genres");
  const producers = searchParams.get("producers");
  const studio = searchParams.get("studios");
  const trailerImageUrl = searchParams.get("trailerImageUrl");
  const trailerUrl = searchParams.get("trailerUrl") || "#";
  const rating = searchParams.get("rating");
  const scoredNum = searchParams.get("scored_by");
  const malID = searchParams.get("mal_id");

  const [mainCharacters, setMainCharacters] = useState<any[]>([]);
  const [supportingCharacters, setSupportingCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchCharacters = async () => {
      if (!malID) return;

      setLoading(true);
      try {
        console.log(malID);
        const response = await animeServices.character(malID);
        if (response.status === 200) {
          const allCharacters = response.data?.data || [];
          console.log("All Characters:", allCharacters);

          const main = allCharacters.filter((char: any) => char.role === "Main").slice(0, 4);
          console.log("Main Characters Array:", main);

          const support = allCharacters.filter((char: any) => char.role === "Supporting").slice(0, 5);
          console.log("Main Characters Array:", support);

          const mainDetails = [];
          for (const char of main) {
            const malId = char.character.mal_id;
            const detail = await animeServices.characterFull(malId);
            mainDetails.push(detail);
            await sleep(1000);
          }

          const supportDetails = [];
          for (const char of support) {
            const malId = char.character.mal_id;
            const detail = await animeServices.characterFull(malId);
            supportDetails.push(detail);
            await sleep(1000);
          }

          console.log(mainDetails);

          setMainCharacters(mainDetails.filter((res) => res !== null).map((res) => res.data.data));
          setSupportingCharacters(supportDetails.filter((res) => res !== null).map((res) => res.data.data));

        }
      } catch (error) {
        console.error("Error fetching characters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [malID]);

  const formatNumber = (num: any) => {
    if (!num) return "0";
    const n = parseInt(num, 10);
    if (n >= 1_000_000) {
      return (n / 1_000_000).toFixed(1) + "M";
    } else if (n >= 1_000) {
      return (n / 1_000).toFixed(1) + "K";
    }
    return n.toString();
  };

  const formattedScoredNum = formatNumber(scoredNum);

  return (
    <div className="anime-container h-screen w-full flex items-center flex-col">
      <div className="anime-img-container w-full flex items-center justify-center"
      style={{
          backgroundImage: `url(${trailerImageUrl})`,
          backgroundSize: "cover",
          backgroundRepeat: "no repeat",
          backgroundPosition: "center",
      }}>
        <img src={image_url || ""} alt={`${title} Poster`} className="img-anime"
        style={{
          height: 300,
          zIndex: 5
        }}
        />
      </div>
      <div className="anime-info-container flex w-4/5">
        <div className="anime-text-info-container w-2/3">
          <h1 className="anime-title">{title}</h1>
          <p className="age-anime">
          {`${rating} | ${episodes} EP`}
          </p>
          <p className="rating-info w-full">
            <img src="" alt="rating Stars" className="rating-stars" />Average Rating is: {score} by ({formattedScoredNum})</p>
          <button className="add-list-btn"><img src="/img/bookmark.svg" alt="" className="img-add-list"/>ADD TO "WATCH LATER"</button>
          <p className="anime-description">{synopsis}</p>
          <h2 className="production-title">Production and Details</h2>
          <div className="production-anime-info"><p className="production-text">Studio</p> {studio}</div>
          <div className="production-anime-info"><p className="production-text">Producers</p> {producers}</div>
          <div className="production-anime-info"><p className="production-text">Genre</p> {genres}</div>
          <div className="production-anime-info"><p className="production-text">Year</p> {year}</div>
        </div>
        <div className="anime-trailer-container w-1/3">
          <h3>Trailer</h3>
          <a href={trailerUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <img
              src={trailerImageUrl || undefined}
              alt={`${title} Trailer`}
              style={{
                width: "300px",
                height: "170px",
                borderRadius: "10px",
              }}
            />
          </a>
          <button>
            <a className="watch-trailer-btn" href={trailerUrl}>Watch Trailer</a>
          </button>
          <div className="play-trailer-btn-container">
            <img className="play-trailer" src="/img/player-play.svg" alt="" />
          </div>
        </div>
      </div>
      <div className="character-container flex flex-col w-4/5">
        <div className="character-title-container">
          <h2 className="character-title">Main</h2>
          <div className="character-item-container flex">
            {mainCharacters.map((char) => (
                  <Character key={char.mal_id} data={char} />
                ))}
          </div>
        </div>
        <div className="character-title-container flex flex-col w-4/5">
          <h2 className="character-title">Support</h2>
          <div className="character-item-container flex">
          {supportingCharacters.map((char) => (
                  <Character key={char.mal_id} data={char} />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Anime;