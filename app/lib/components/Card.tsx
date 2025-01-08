"use client"; 
import React from 'react';
import Image from 'next/image';

export default function Card({data}: {data: {
    title: string;
    episodes: string;
    images: { 
        jpg: { image_url: string, large_image_url: string, small_image_url: string },
        webp: { image_url: string, large_image_url: string, small_image_url: string }
    };
    genres: { name: string }[];
    synopsis: string;
    score: string;
    year: string 
}}) {
    const genreNames = data.genres ? data.genres.map(genre => genre.name).join(", ") : "No genres available";

    return (
        <div className="card-container h-500 px-12 py-6 flex justify-center flex-col">
            <Image 
                src={data?.images?.jpg.image_url} 
                width={195} 
                height={330} 
                alt={data.title} 
                className=' card-img w-[195px] h-[330px] brightness-55 mb-5 rounded-[10px]'
            />
            <h2 className= "cardTitle" style={{
                width: 195,
                 marginBottom: 5,
                textAlign: 'start',
                color: 'white',
                fontSize: 16,
                fontWeight: 600,
                display: '-webkit-box',
                WebkitLineClamp: 1, 
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
                     }}>{data.title}</h2>
            <p className= "cardEp" style={{maxWidth: 195, height: 20, textAlign: 'start', color: 'grey', fontSize: 14}}>{data.episodes} EP</p>
            <div className='card-hovered'>
                <h2 style={{width: 195, marginBottom: 5, textAlign: 'start', color: '#fff', fontSize: 16, fontWeight: 600}}>{data.title}</h2>
                <p style={{maxWidth: 195, height: 20, textAlign: 'start', color: 'grey', fontSize: 14, fontWeight: 500}}>{data.episodes} EP</p>
                <p style={{maxWidth: 195, height: 20, textAlign: 'start', color: 'grey', fontSize: 14, fontWeight: 500}}>Year: {data.year}</p>
                <p style={{maxWidth: 195, height: 20, textAlign: 'start', color: 'grey', fontSize: 14, fontWeight: 500}}>Rating: {data.score}</p>
                <p 
                    className="synopsis-text" 
                    style={{ 
                        maxWidth: 195, 
                        color: '#fff', 
                        fontSize: 13,
                        display: '-webkit-box',
                        WebkitLineClamp: 6, 
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                >
                    {data.synopsis}
                </p>
                <p className= "cardGenre" style={{maxWidth: 195, height: 50, textAlign: 'start', color: 'grey', fontSize: 14}}>Genre: {genreNames}</p>
            </div>
        </div>
    );
}