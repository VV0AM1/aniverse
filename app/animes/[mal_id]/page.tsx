import { Suspense } from "react";
import Anime from "@/app/lib/components/Anime";
import NavBar from "@/app/lib/components/NavBar";


export default function AnimeDetailPage() {
  return (
    <main className="anime-detail-page">
        <NavBar />
      <Suspense fallback={<div>Loading anime details...</div>}>
        <Anime />
      </Suspense>
    </main>
  );
}