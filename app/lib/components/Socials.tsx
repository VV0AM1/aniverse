"use client";

import React from "react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Socials() {
  return (
    <section
      className="relative w-full h-[400px] sm:mt-[80px]  flex items-center justify-center bg-cover bg-center text-white"
      style={{
        backgroundImage: "url('/img/social-bg.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/70 z-0" />

      <div className="relative z-10 text-center px-6 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">AniVerse</h1>
        <p className="text-purple-400 text-xs sm:text-sm mb-4 tracking-wide">
          アニメに関することなら何でも
        </p>
        <p className="text-sm sm:text-base text-gray-200 leading-relaxed mb-6">
          Your ultimate source for everything anime! Discover reviews, the latest
          recommendations, fan-favorite characters, and exciting news and trivia.
          Dive into the world of anime with us and find your next favorite series!
        </p>

        <div className="flex justify-center gap-6">
          <a href="#" aria-label="GitHub" className="hover:text-purple-400 transition text-2xl">
            <FaGithub />
          </a>
          <a href="#" aria-label="LinkedIn" className="hover:text-purple-400 transition text-2xl">
            <FaLinkedin />
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-purple-400 transition text-2xl">
            <FaInstagram />
          </a>
        </div>
      </div>
    </section>
  );
}