"use client"; 
import React from 'react';

interface AnimeProps {
  title: string;
  image: string;
}

const Card: React.FC<AnimeProps> = ({ title, image }) => {
  return (
    <div className="card-container mx-12">
      <img src={image} alt={title} className='w-[195px] h-[330px] brightness-60'/>
      <h2>{title}</h2>
      <p></p>
    </div>
  );
};

export default Card;