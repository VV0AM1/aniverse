'use client';

import React, { useState, useEffect, useRef } from "react";
import { animeServices } from "@/app/lib/services/animes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SkeletonLoader from "./SkeletonLoader";

const NavBar: React.FC = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [nickname, setNickname] = useState<string | null>(null);

  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const catalogButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    if (storedNickname) setNickname(storedNickname);
  }, []);

  const toggleMenu = () => setIsMenuVisible(!isMenuVisible);
  const toggleSearch = () => {
    setIsSearchVisible(prev => !prev);
    if (isSearchVisible) {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleRedirect = async () => {
    try {
      const response = await animeServices.getRandom();
      if (response.status === 200) {
        const mal_id = response.data.data.mal_id;
        router.push(`/animes/${mal_id}`);
      }
    } catch (error) {
      console.error("Failed to fetch random anime:", error);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current && !menuRef.current.contains(event.target as Node) &&
      !catalogButtonRef.current?.contains(event.target as Node)
    ) {
      setIsMenuVisible(false);
    }

    const searchButton = document.getElementById("nav-btn-search");
    const searchIcon = document.getElementById("nav-icon-search");
    if (
      searchRef.current && !searchRef.current.contains(event.target as Node) &&
      event.target !== searchButton && event.target !== searchIcon
    ) {
      setIsFadingOut(true);
      setTimeout(() => {
        setIsSearchVisible(false);
        setIsFadingOut(false);
        setSearchQuery("");
        setSearchResults([]);
      }, 300);
    }
  };

  useEffect(() => {
    if (isMenuVisible || isSearchVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuVisible, isSearchVisible]);

  const fetchAnime = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const response = await animeServices.getAnimeByName(query);
      if (response.status === 200) {
        setSearchResults(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) fetchAnime(searchQuery);
    }, 1500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem("nickname");
    localStorage.removeItem("token");
    setNickname(null);
    router.push("/");
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] z-[9999]">
      <div className="relative w-full">
        <nav className="h-[80px] bg-[#23252b5e] backdrop-blur-xl rounded-full px-4 sm:px-6 flex justify-between items-center">
          <div className="flex gap-2 sm:gap-4 items-center">
            <button
              ref={catalogButtonRef}
              onClick={toggleMenu}
              className="text-white text-sm px-4 py-3 rounded-full hover:bg-[#121316] hover:text-purple-400 transition"
            >
              Catalog
            </button>
            {nickname ? (
              <Link
                href={`/Dashboard`}
                className="text-white text-sm px-4 py-3 rounded-full hover:bg-[#121316] hover:text-purple-400 transition flex items-center gap-2"
              >
                <img src="/img/user.svg" className="w-4 h-4" alt="User" />
                {nickname}
              </Link>
            ) : (
              <Link href="/Login" className="text-white text-sm px-4 py-3 rounded-full hover:bg-[#121316] hover:text-purple-400 transition">
                Log-In
              </Link>
            )}
            <button onClick={handleRedirect} className="text-white text-sm px-4 py-3 rounded-full hover:bg-[#121316] hover:text-purple-400 transition">
              Random
            </button>
          </div>

          <Link
            href="/"
            className="hidden sm:block text-xl font-bold bg-gradient-to-r from-[#43bee3] via-[#4d00dd] to-[#e343ae] text-transparent bg-clip-text animate-[gradientShift_5s_ease_infinite]"
          >
            AniVerse
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              id="nav-btn-search"
              onClick={toggleSearch}
              className="text-white p-3 rounded-full hover:bg-[#121316] hover:text-purple-400 transition"
            >
              <img id="nav-icon-search" src="/img/search.svg" className="w-4 h-4" alt="Search" />
            </button>

            {nickname ? (
              <button onClick={handleLogout} className="text-white text-sm px-4 py-3 rounded-full hover:bg-[#121316] hover:text-purple-400 transition">
                Log Out
              </button>
            ) : (
              <Link href="/" className="text-white text-sm px-4 py-3 rounded-full hover:bg-[#121316] hover:text-purple-400 transition">
                Home
              </Link>
            )}

            <Link href="/chat" className="text-white p-3 rounded-full hover:bg-[#121316] hover:text-purple-400 transition">
              <img src="/img/brand-line.svg" className="w-4 h-4" alt="Chat" />
            </Link>
          </div>
        </nav>

        <div
          ref={menuRef}
          className={`absolute left-12 top-full mt-2 w-[90%] max-w-[900px] rounded-3xl bg-[#121316c9] backdrop-blur-xl z-50 transition-all duration-500 ease-in-out overflow-hidden ${
            isMenuVisible ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex p-6 gap-6">
            <div className="flex flex-col w-[150px] gap-2">
              {["Trending", "Airing", "Upcoming", "Manga"].map((item) => (
                <Link key={item} href={`/${item}`} className="text-sm text-white px-3 py-2 rounded hover:bg-[#23252b] transition">
                  {item}
                </Link>
              ))}
            </div>

            <div className="w-[2px] bg-[#23252b]" />

            <div className="flex-1">
              <h3 className="text-gray-300 mb-3">GENRE</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  "Action", "Adventure", "Comedy", "Drama", "Fantasy",
                  "Music", "Romance", "Sci-Fi", "Seinen", "Shoujo",
                  "Isekai", "Erotica", "Sports", "Mystery", "Horror"
                ].map((genre) => (
                  <Link key={genre} href={`/Genres/${genre}`} className="text-sm text-white px-3 py-1 rounded hover:bg-[#23252b] transition">
                    {genre}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isSearchVisible && (
          <div
            ref={searchRef}
            className="absolute top-full right-0 mt-2 w-[90%] sm:w-[400px] p-3 rounded-[30px] bg-[#121316] shadow-lg z-50"
          >
            <input
              className="w-full px-4 py-2 rounded-full bg-[#2b2d2d] text-white text-sm outline-none placeholder:text-gray-400"
              placeholder="Search for anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {loading ? (
              <>
                <SkeletonLoader />
                <SkeletonLoader />
                <SkeletonLoader />
              </>
            ) : (
              <ul className="mt-3 space-y-2 max-h-[200px] overflow-y-auto text-white text-sm custom-scroll">
                {searchResults.length > 0 ? (
                  searchResults.map((anime) => (
                    <li key={anime.mal_id}>
                      <Link href={`/animes/${anime.mal_id}`} className="flex items-center gap-3 p-2 hover:bg-[#23252b] rounded-lg">
                        <img src={anime.images.jpg.small_image_url} alt={anime.title} className="w-[50px] h-[60px] object-cover rounded" />
                        {anime.title}
                      </Link>
                    </li>
                  ))
                ) : (
                  searchQuery && <p className="text-white text-sm mt-2">No results found.</p>
                )}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
