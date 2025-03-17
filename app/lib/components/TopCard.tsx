import Image from "next/image";

export default function TopCard({
    data,
    index,
}: {
    data: {
        mal_id: string;
        title_english?: string;
        name?: string;
        chapters: string;
        favorites: string;
        score: string;
        episodes: string;
        images: {
            jpg: { image_url: string; large_image_url: string; small_image_url: string };
            webp: { image_url: string; large_image_url: string; small_image_url: string };
        };
    };
    index: number;
}) {
  return (
    <div className="top-card-container">
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

        <div className="top-card-info flex">
            <h3 className="top-title-home"
            style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
            }}
            
            >{data.title_english || data.name}</h3>
            <div className="top-eps">
                <p className="top-card-description"
                style={{
                    fontSize: "10px",
                    background: "#FFDD95",
                    padding: "1px 2px",
                    borderRadius: "3px",
                    display: "flex",
                    justifyContent: "center",
                    height: "24px",
                    alignItems: "center"
                
                }}
                >
                    CC: {data.episodes ? `${data.episodes} EP` : data.chapters ? `${data.chapters} CH` : "??"}                
                    </p>
            </div>
        </div>

    </div>
  );
}

//FFA600