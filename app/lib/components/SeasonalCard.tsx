"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SeasonalCard({ data, index }: any) {
  const router = useRouter();

  const handleRedirect = () => {
    if (data.episodes !== undefined) router.push(`/animes/${data.mal_id}`);
    else if (data.chapters !== undefined) router.push(`/mangas/${data.mal_id}`);
  };

  const japaneseTitle =
    data.titles?.find((t: any) => t.type === "Japanese")?.title || "N/A";

  const formatRating = (rating?: string) => {
    if (!rating) return "14+";
    return rating.replace(/(-.{3}).*/, "$1");
  };

  const isPopupLeft = index >= 5;

  return (
    <div
      onClick={handleRedirect}
      className="relative cursor-pointer w-[210px] h-[340px] rounded-lg overflow-visible group"
    >
      <div className="w-full h-[80%] relative overflow-hidden rounded-t-lg">
        <Image
          src={data.images.jpg.image_url}
          alt={data.title}
          fill
          className="object-cover rounded-t-lg transition-all duration-300 ease-in-out group-hover:blur-[2px] group-hover:brightness-75"
        />
        <img
          src="/img/player-big.svg"
          alt="Play"
          className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>

      <div className="p-2 text-white text-xs">
        <h2 className="truncate font-medium">{data.title}</h2>
        <div className="flex justify-between text-gray-400 text-[11px] mt-1">
          <span>{data.duration?.replace(" per ep", "") || `${data.volumes} vol`}</span>
          <span>{data.type}</span>
        </div>
      </div>

        <div
          className={`absolute top-0 ${
            isPopupLeft ? "right-full mr-4" : "left-full ml-4"
          } z-50 w-[380px] max-w-[90vw] h-[340px] p-4 bg-[#1b1b1b]/90 backdrop-blur-md rounded-xl text-white shadow-lg
          opacity-0 scale-95 transition-all duration-300 ease-in-out
          pointer-events-none sm:group-hover:pointer-events-auto hidden sm:group-hover:flex flex-col`}
        >
        <h2 className="text-md font-semibold mb-1 line-clamp-2">{data.title}</h2>
        <p className="text-gray-300 text-sm mb-2">
          {data.episodes ? `${data.episodes} Episodes` : `${data.chapters} Chapters`} | {data.year}
        </p>

        <div className="flex flex-wrap gap-2 text-[14px] mb-3">
          <span className="bg-sky-600 px-2 py-1 rounded flex items-center gap-1">
            <img src="/img/star.svg" className="w-3 h-3" /> {data.score}
          </span>
          <span className="bg-lime-600 px-2 py-1 rounded">{formatRating(data.rating)}</span>
          <span className="bg-white text-black px-2 py-1 rounded flex items-center gap-1">
            <img src="/img/medal.svg" className="w-3 h-3" /> {data.rank}
          </span>
          <span className="bg-emerald-600 text-white px-2 py-1 rounded flex items-center gap-1">
            <img src="/img/heart.svg" className="w-3 h-3" /> {data.popularity}
          </span>
          <span className="bg-yellow-600 text-white px-2 py-1 rounded flex items-center gap-1">
            <img src="/img/eye.svg" className="w-3 h-3" /> {data.members}
          </span>
        </div>

        <p className="line-clamp-3 text-gray-200">{data.synopsis}</p>

        <div className="mt-2 text-sm space-y-1">
          <p><b>Japanese:</b> {japaneseTitle}</p>
          <p><b>Aired:</b> {data.aired?.string?.split(" to ")[0] || data.published?.string}</p>
          <p><b>Status:</b> {data.status}</p>
        </div>
        {data.genres?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {data.genres.map((genre: any) => (
            <span
              key={genre.name}
              className="px-2 py-1 text-[14px] bg-[#2e2e2e] text-white rounded-full border border-white/10"
            >
              {genre.name}
            </span>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}