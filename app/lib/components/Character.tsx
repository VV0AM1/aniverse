"use client";
import React from "react";

export default function Character({ data }: { data: any }) {
  const { name, about, images } = data;

  return (
    <div className="character-card flex flex-col">
      <img
        src={images?.jpg?.image_url || ""}
        alt={name}
        className="character-image"
        style={{
          height: 160,
          width: 120,

        }}
      />
      <div className="character-info">
        <h3 className="character-name">{name}</h3>
      </div>
    </div>
  );
}