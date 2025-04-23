import Image from "next/image";
import TopCardSkeleton from "./TopSkeletonLoader";
import { useRouter } from "next/navigation";

export default function TopCard({
    data,
    index,
  }: {
    data: {
      mal_id: string;
      title_english?: string;
      name?: string;
      chapters?: string;
      favorites?: string;
      score: string;
      nicknames?: string;
      episodes?: string;
      anime?: {
        role: string;
        anime: {
          mal_id: number;
          title: string;
          images: {
            jpg: { image_url: string; small_image_url: string };
          };
        };
      }[];
      images: {
        jpg: { image_url: string; large_image_url: string; small_image_url: string };
        webp: { image_url: string; large_image_url: string; small_image_url: string };
      };
    };
    index: number;
  }) {

      const router = useRouter();
      const isLoading = !data;
    
      if (isLoading) {
        return <TopCardSkeleton />;
      }
    
      const handleRedirect = () => {
        if ("episodes" in data && typeof data.episodes !== "undefined") {
          router.push(`/animes/${data.mal_id}`);
        } else if ("chapters" in data && typeof data.chapters !== "undefined") {
          router.push(`/mangas/${data.mal_id}`);
        } else if (
          "anime" in data &&
          Array.isArray(data.anime) &&
          data.anime.length > 0 &&
          "mal_id" in data.anime[0].anime
        ) {
          const animeId = data.anime[0].anime.mal_id;
          router.push(`/characters/${data.mal_id}?featuredAnime=${animeId}`);
        }
      };
    
  
    return (
      <div onClick={handleRedirect} className="top-card-container">
        <Image
          src={data?.images?.jpg.image_url}
          alt={data.title_english || data.name || "Unknown"}
          width={100}
          height={160}
          className="rounded-lg"
          style={{
            width: "20%",
            height: "115%",
          }}
        />
  
        <div className="top-card-info flex flex-col">
          <h3
            className="top-title-home"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {data.title_english || data.name}
          </h3>
          <div className="top-eps">
            <p
              className="top-card-description"
              style={{
                fontSize: "10px",
                background: "#FFDD95",
                borderRadius: "3px",
                display: "flex",
                justifyContent: "center",
                height: "20px",
                alignItems: "center",
              }}
            >
              CC: {data.episodes ? `${data.episodes} EP` : data.chapters ? `${data.chapters} CH` : "??"}
            </p>
            <p
              className="top-card-description"
              style={{
                fontSize: "10px",
                background: "#972eb7",
                borderRadius: "3px",
                display: "flex",
                justifyContent: "center",
                height: "20px",
                alignItems: "center",
              }}
            >
              <img src="/img/small-start.svg" alt="star" className="star" />
              {data.score || data.favorites}
            </p>
          </div>
        </div>
      </div>
    );
  }