'use client'

import Image from "next/image";
import NavBar from "./lib/components/NavBar";
import Card from "./lib/components/Card";
import "./series/global.css";
import Home from "./lib/components/Home";
import AnimesArray from '@/app/lib/jsons/cards-anime.json'
import { useEffect, useState } from "react";
import { animeServices } from "./lib/services/animes";
import axios from 'axios';

interface Anime {
  title: string;
  image: string;
}

export default function HomePage() {

  const [animes, setAnimes] = useState<Anime[]>([]);

  useEffect(() => {
    const fetchAnimeData = async () => {
      try {
        const narutoResponse = await axios.get(`https://api.jikan.moe/v4/anime?q=naruto&limit=5`);
        const tokyoGhoulResponse = await axios.get(`https://api.jikan.moe/v4/anime?q=tokyo&ghoul&limit=5`);
        const bleachResponse = await axios.get(`https://api.jikan.moe/v4/anime?q=bleach&limit=5`);


        setAnimes([
          {
            title: 'Naruto',
            image: narutoResponse.data.data[0].images.jpg.image_url
          },
          {
            title: 'Tokyo Ghoul',
            image: tokyoGhoulResponse.data.data[0].images.jpg.image_url
          },
          {
            title: 'Bleach',
            image: bleachResponse.data.data[0].images.jpg.image_url
          }
        ]);
      } catch (error) {
        console.error('Error fetching anime data:', error);
      }
    };

    fetchAnimeData();
  }, []);
  


  return (
    <div>
        <NavBar/>
        <Home>
        <div className="flex w-[80%] justify-center flex-wrap">
        {animes.map((anime, index) => (
            <Card key={index} title={anime.title} image={anime.image} />
          ))}
        </div>
        </Home>
        
    </div>
  );
}
