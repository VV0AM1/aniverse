'use client'

import NavBar from "./lib/components/NavBar";
import Card from "./lib/components/Card";
import "./series/global.css";
import Home from "./lib/components/Home";
import AnimesArray from '@/app/lib/jsons/cards-anime.json'
import { useEffect, useState } from "react";
import { animeServices } from "./lib/services/animes";


export default function HomePage() {

  const [animes, setAnimes] = useState([]);


  useEffect(() => {
    const getAllAnimes = async () => {
      try {
        const response = await animeServices.all();
        console.log("This is response",response)
        if (response.status == 200){
          setAnimes(response.data.data)
        }
      } catch (error) {
        console.error(error);
      }
    }
    getAllAnimes();

  }, [])


  useEffect(() => {
    
  console.log(animes)

  }, [animes])
  
  


  return (
    <div>
        <NavBar/>
        <Home>
        <div className="flex w-[80%] justify-center flex-wrap">
        {
        animes.map((anime)=>{
        return (
            <Card data={anime} />
          )
        })}
        </div>
        </Home>
        
    </div>
  );
}
