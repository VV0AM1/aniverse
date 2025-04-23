"use client";
import React from "react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Socials() {
  return (
    <section
      className="social-container w-full h-[400px] flex items-center justify-center bg-cover bg-center text-white"
      style={{
        backgroundImage: "url('/img/social-bg.jpg')", 
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-70 z-0" />
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <h1 className="text-4xl font-bold mb-2">AniVerse</h1>
        <p className="text-purple-400 text-sm mb-4">
          アニメに関することなら何でも
        </p>
        <p className="text-base leading-relaxed mb-6">
          Your ultimate source for everything anime! Discover reviews, the latest recommendations,
          fan-favorite characters, and exciting news and trivia. Dive into the world of anime with
          us and find your next favorite series to enjoy!
        </p>
        <div className="flex justify-center space-x-4">
          <a href="#" aria-label="GitHub">
            <FaGithub className="text-white text-2xl hover:text-purple-400 transition" />
          </a>
          <a href="#" aria-label="LinkedIn">
            <FaLinkedin className="text-white text-2xl hover:text-purple-400 transition" />
          </a>
          <a href="#" aria-label="Instagram">
            <FaInstagram className="text-white text-2xl hover:text-purple-400 transition" />
          </a>
        </div>
      </div>
    </section>
  );
}