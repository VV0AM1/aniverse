"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SmallCard({
    data,
}: {
    data: {
        mal_id: string;
        title: string;
        episodes: string;
        images: {
            jpg: { image_url: string; large_image_url: string; small_image_url: string };
            webp: { image_url: string; large_image_url: string; small_image_url: string };
        };
        genres: { name: string }[];
        synopsis: string;
        score: string;
        year: string;
        rating: string;
        producers: { name: string }[];
        studios: { name: string }[];
        trailer: {
            url: string;
            images: {image_url: string; large_image_url: string; small_image_url: string; medium_image_url: string }
        };
        scored_by: string;
    };
}) {
    const [isFlipped, setIsFlipped] = useState(false);
    const router = useRouter();

    const handleRedirect = () => {
        router.push(
            `/Anime?mal_id=${encodeURIComponent(data.mal_id)}&title=${encodeURIComponent(data.title)}&episodes=${data.episodes}&image_url=${encodeURIComponent(
                data.images.jpg.large_image_url
            )}&synopsis=${encodeURIComponent(data.synopsis)}&score=${data.score}&year=${data.year}&genres=${encodeURIComponent(
                data.genres.map((g) => g.name).join(', ')
            )}&producers=${encodeURIComponent(
                data.producers.map((p) => p.name).join(', ')
            )}&studios=${encodeURIComponent(
                data.studios.map((s) => s.name).join(', ')
            )}&trailerImageUrl=${encodeURIComponent(
                data.trailer.images.medium_image_url
            )}&trailerUrl=${encodeURIComponent(data.trailer.url)}&rating=${data.rating}&scored_by=${data.scored_by}`
        );
    };

    const genreNames = data.genres ? data.genres.map((genre) => genre.name).join(', ') : 'No genres available';

    return (
        <div className="small-card" onClick={handleRedirect}>
          <div className="small-card-container">
            <div className="small-card-front">
              <Image
                src={data?.images?.jpg.image_url}
                width={170}
                height={280}
                alt={data.title}
                className="card-img"
              />
              <h2 className="small-cardTitle">{data.title}</h2>
            </div>
    
            <div className="small-card-hovered">
              <h2
                style={{
                  width: 150,
                  marginTop: 0,
                  marginBottom: 5,
                  textAlign: "start",
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {data.title}
              </h2>
              <p
                style={{
                  maxWidth: 140,
                  width: 50,
                  height: 25,
                  textAlign: "start",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlignLast: "center",
                  background: "#27779b",
                  borderRadius: 5,
                  marginBottom: 5,
                  fontSize: 11,
                  fontWeight: 500,
                }}
              >
                {data.episodes} EP
              </p>
              <p
                style={{
                  maxWidth: 140,
                  width: 70,
                  height: 25,
                  textAlign: "start",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlignLast: "center",
                  background: "#7636bf",
                  borderRadius: 5,
                  marginBottom: 5,
                  fontSize: 11,
                  fontWeight: 500,
                }}
              >
                Year: {data.year}
              </p>
              <p
                style={{
                  maxWidth: 140,
                  width: 70,
                  height: 25,
                  textAlign: "start",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlignLast: "center",
                  background: "#c9c749",
                  borderRadius: 5,
                  marginBottom: 5,
                  fontSize: 11,
                  fontWeight: 500,
                }}
              >
                Rating: {data.score}
              </p>
              <p
                className="small-synopsis-text"
                style={{
                  maxWidth: 140,
                  color: "#fff",
                  fontSize: 10,
                  display: "-webkit-box",
                  WebkitLineClamp: 8,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {data.synopsis}
              </p>
            </div>
          </div>
        </div>
      );
}

