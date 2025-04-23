import { Suspense } from "react";
import MangaDetailed from "@/app/lib/components/MangaDetail";
import NavBar from "@/app/lib/components/NavBar";


export default function AnimeDetailPage() {
  return (
    <main className="anime-detail-page">
        <NavBar />
      <Suspense fallback={<div>Loading anime details...</div>}>
        <MangaDetailed />
      </Suspense>
    </main>
  );
}