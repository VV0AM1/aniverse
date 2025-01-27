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
        <div className="small-card">
            <div
                className={`small-card-container ${isFlipped ? 'flipped' : ''}`}
                style={{
                    height: 320,
                    padding: '12px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div className="small-card-front">
                    <Image
                        src={data?.images?.jpg.image_url}
                        width={150}
                        height={210}
                        alt={data.title}
                        className="card-img"
                        style={{
                            width: '150px',
                            height: '210px',
                            marginBottom: '12px',
                            borderRadius: '5px',
                        }}
                        onClick={() => {
                            handleRedirect();
                          }}
                    />
                    <h2
                        className="small-cardTitle"
                        style={{
                            width: 130,
                            textAlign: 'start',
                            color: 'white',
                            fontSize: 12,
                            fontWeight: 500,
                            height: 20,
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {data.title}
                    </h2>
                    <p
                        className="small-cardEp"
                        style={{
                            maxWidth: 130,
                            height: 15,
                            textAlign: 'start',
                            color: 'grey',
                            fontSize: 10,
                        }}
                    >
                        {data.episodes} EP
                    </p>
                    <button className="small-more-btn" onClick={() => setIsFlipped(true)}>More</button>
                </div>
                <div
                    className="small-card-hovered"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        marginTop: 10,
                    }}
                >
                    <h2
                        style={{
                            width: 140,
                            marginBottom: 5,
                            textAlign: 'start',
                            color: '#fff',
                            fontSize: 12,
                            fontWeight: 600,
                        }}
                    >
                        {data.title}
                    </h2>
                    <p
                        style={{
                            maxWidth: 140,
                            height: 20,
                            textAlign: 'start',
                            color: 'grey',
                            fontSize: 11,
                            fontWeight: 500,
                        }}
                    >
                        {data.episodes} EP
                    </p>
                    <p
                        style={{
                            maxWidth: 140,
                            height: 20,
                            textAlign: 'start',
                            color: 'grey',
                            fontSize: 11,
                            fontWeight: 500,
                        }}
                    >
                        Year: {data.year}
                    </p>
                    <p
                        style={{
                            maxWidth: 140,
                            height: 20,
                            textAlign: 'start',
                            color: 'grey',
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
                            color: '#fff',
                            fontSize: 10,
                            display: '-webkit-box',
                            WebkitLineClamp: 7,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {data.synopsis}
                    </p>
                    <button className='small-back-btn'
                    onClick={() => setIsFlipped(false)}
>                      Back
                    </button>
                </div>
            </div>
        </div>
    );
}

