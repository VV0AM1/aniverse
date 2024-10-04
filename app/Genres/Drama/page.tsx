"use client"




import NavBar from "@/app/lib/components/NavBar";
import Card from "@/app/lib/components/Card";
import Home from "@/app/lib/components/Home";
import AnimesArray from '@/app/lib/jsons/cards-anime.json'
import { useEffect, useState } from "react";
import { animeServices } from "@/app/lib/services/animes";
import axios from 'axios';



export default function HomePage() {

  const [animes, setAnimes] = useState();
  const [genres, setGenres] = useState();


  useEffect(() => {

    const getAllAnimes = async () => {
      try {
        const response = await animeServices.all();
        console.log("This is response",response)
        if (response.status == 200){
          const animeData = response.data.data;

          // Set animes
          setAnimes(animeData);
    
          // Filter animes with the "Action" genre and log their names
          const actionAnimes = animeData.filter(anime =>
            anime.genres.some(genre => genre.name === "Drama")
          );
    
          console.log("Animes with 'Sci-Fi' genre:");
          actionAnimes.forEach(anime => console.log(anime.title));
           //IMPORTANTE!! Aquí es donde apuntas a la data en concreto. Para saber la estructura, puedes hacerlo en la consola del navegador. En el console.log de arriba es donde podrás ver la estructura y toda la data que te devuelve. En la rest API también tienes un ejemplo de la data que devuelve con su estructura. Importante estudiar cómo acceder a ello.
        }
      } catch (error) {
        console.error('Error fetching anime data:', error);
      }
    };
    
    getAllAnimes();
  }, [animes, genres]);



  return (
    <div>
      <NavBar />
      <Home>
        <div className="flex w-[100%] h-[80vh] justify-center flex-wrap mt-100">
          {
            animes && animes
              .filter(anime => anime.genres.some(genre => genre.name === "Drama")) // Filter animes with "Action" genre
              .map((anime) => {
                return (
                  <Card key={anime.mal_id} data={anime} /> // Include a unique key prop
                )
              })
          }
        </div>
      </Home>
    </div>
  );
}


