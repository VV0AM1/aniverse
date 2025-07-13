import React from "react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-[#111] text-white px-6 py-10 mt-[-10px]">
      <div className="flex flex-wrap justify-between gap-10 max-w-7xl mx-auto">
        <div className="flex-1 min-w-[250px]">
          <h2 className="text-2xl font-bold mb-2">Aniverse</h2>
          <p className="text-purple-400 text-sm mb-2">アニメに関することなら何でも</p>
          <p className="text-sm text-gray-300 mb-4">
            Your ultimate source for everything anime! Discover reviews, the latest
            recommendations, fan-favorite characters, and exciting news and trivia.
          </p>
          <div className="flex gap-4">
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

        <div className="flex-1 min-w-[200px]">
          <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
          <div className="flex flex-col gap-2 text-sm text-gray-400">
            <a href="/" className="hover:text-white transition">Home</a>
            <a href="/" className="hover:text-white transition">Me</a>
            <a href="/Login" className="hover:text-white transition">Log-in</a>
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <h2 className="text-lg font-semibold mb-3">Visit This</h2>
          <div className="flex flex-col gap-2 text-sm text-gray-400">
            <a href="/Manga" className="hover:text-white transition">Manga</a>
            <a href="/Airing" className="hover:text-white transition">Airing</a>
            <a href="/Upcoming" className="hover:text-white transition">Upcoming</a>
            <a href="/Trending" className="hover:text-white transition">Trending</a>
            <a href="/" className="hover:text-white transition">Home</a>
            <a href="/Random" className="hover:text-white transition">Random</a>
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <h2 className="text-lg font-semibold mb-3">Our Socials</h2>
          <div className="flex flex-col gap-3">
            <a href="#" aria-label="GitHub">
              <FaGithub className="text-gray-400 text-2xl hover:text-purple-400 transition" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <FaLinkedin className="text-gray-400 text-2xl hover:text-purple-400 transition" />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram className="text-gray-400 text-2xl hover:text-purple-400 transition" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
        <p>© 2025 Aniverse. All rights reserved.</p>
        <p>Powered by Jikan API</p>
      </div>
    </footer>
  );
}