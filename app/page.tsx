import Image from "next/image";
import NavBar from "./lib/components/NavBar";
import Card from "./lib/components/Card";
import "./series/global.css";
import Home from "./lib/components/Home";
import AnimesArray from '@/app/lib/jsons/cards-anime.json'

export default function HomePage() {
  return (
    <div>
        <NavBar/>
        <Home>
        <div className="flex w-[80%] justify-center flex-wrap">
        {
        AnimesArray.map((anime)=>{
          console.log("This is anime", anime)
        return (
            <Card data={anime} />
          )
        })}
        </div>
        </Home>
        
    </div>
  );
}
