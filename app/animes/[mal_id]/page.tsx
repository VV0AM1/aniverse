import { Suspense } from "react";
import Anime from "@/app/lib/components/Anime";


export default function AnimeDetailPage() {
  return (
    <main className="anime-detail-page">
      <Suspense fallback={<div>Loading anime details...</div>}>
        <Anime />
      </Suspense>
    </main>
  );
}