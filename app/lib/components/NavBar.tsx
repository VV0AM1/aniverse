"use client";

import React, { useState, useEffect, useRef } from "react";
import { animeServices } from "@/app/lib/services/animes";
import Link from "next/link";
import SkeletonLoader from "./SkeletonLoader"; // Import skeleton loader

const NavBar: React.FC = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const toggleSearch = () => {
    setIsSearchVisible((prev) => !prev);
    if (isSearchVisible) {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const searchButtonRef = useRef<HTMLButtonElement>(null); 
  const handleClickOutside = (event: MouseEvent) => {
    const searchButton = document.getElementById("nav-btn-search");
    const searchIcon = document.getElementById("nav-icon-search");
  
    if (
      menuRef.current && 
      !menuRef.current.contains(event.target as Node) &&
      event.target !== searchButton &&
      event.target !== searchIcon
    ) {
      setIsMenuVisible(false);
    }
    
    if (
      searchRef.current && 
      !searchRef.current.contains(event.target as Node) &&
      event.target !== searchButton &&
      event.target !== searchIcon
    ) {
      setIsSearchVisible(false);
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
      if (searchQuery) {
        fetchAnime(searchQuery);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <>
      <nav className="header">
        <div className="nav-btn-container">
          <button id="nav-btn" onClick={toggleMenu} className="nav-btn">
            Catalog
          </button>
          <a href="/" className="nav-btn">Home</a>
          <a href="#" className="nav-btn">News</a>
        </div>
        <div className="menu-container">
          <a href="/" className="logo">AniVere</a>
        </div>
        <div className="nav-btn-container">
          <button id="nav-btn-search" className="nav-btn" onClick={toggleSearch}>
            <img id="nav-icon-search"  src="/img/search.svg" alt="Search" />
          </button>
          <a href="#" className="nav-btn">Log-In</a>
          <a href="#" className="nav-btn">
            <img src="/img/bookmark.svg" alt="Cart" />
          </a>
        </div>
      </nav>

      {isSearchVisible && (
        <div ref={searchRef} 
          className="search-box"
          style={{
            position: "fixed",
            opacity: 1,
            top: "100px",
            right: "90px",
            width: "450px",
            backgroundColor: "#121316",
            padding: "10px",
            borderRadius: "5px",
            zIndex: 100,
            boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
            transition: "opacity 0.3s ease-in-out"
          }}
        >
          <input
            type="text"
            placeholder="Search for anime..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          {loading ? (
            <div>
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
            </div>
          ) : (
            <>
              {!loading && searchResults.length > 0 && (
                <ul
                  style={{
                    listStyle: "none",
                    marginTop: "10px",
                    padding: 0,
                    color: "#fff",
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                >
                  {searchResults.map((anime) => (
                    <li key={anime.mal_id}>
                      <a
                        href={`/Anime?mal_id=${encodeURIComponent(anime.mal_id)}`}
                        style={{
                          display: "flex",
                          padding: "5px 0",
                          color: "#fff",
                          textDecoration: "none",
                        }}
                      >
                        <img
                          src={anime.images.jpg.small_image_url}
                          alt={anime.title}
                          style={{ width: "50px", height: "60px", marginRight: "10px" }}
                        />
                        {anime.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {!loading && searchResults.length === 0 && searchQuery && (
                <p style={{ color: "#fff", marginTop: "10px" }}>No results found.</p>
              )}
            </>
          )}
        </div>
      )}

      <div ref={menuRef} 
        className="menu"
        style={{
          maxHeight: isMenuVisible ? "370px" : "0px",
          opacity: isMenuVisible ? 1 : 0,
          transform: isMenuVisible ? "translateY(70px)" : "translateY(60px)",
          transition: "all 0.5s ease",
          overflow: "hidden",
        }}
      >
        <div className="menu-bars">
          <div className="menu-item-container"><a href="/Trending" className="menu-item">Trending</a></div>
          <div className="menu-item-container"><a href="/Airing" className="menu-item">Airing</a></div>
          <div className="menu-item-container"><a href="/Upcoming" className="menu-item">Upcoming</a></div>
          <div className="menu-item-container"><a href="/Manga" className="menu-item">Manga</a></div>
        </div>

        <div className="right-menu">
          <div className="genre-menu-title-container"><p className="genre-menu-title">GENRE</p></div>
          <div className="genre-bars">
            {[
              "Action", "Adventure", "Comedy", "Drama", "Fantasy",
              "Music", "Romance", "Sci-Fi", "Seinen", "Shoujo",
              "Isekai", "Erotica", "Sports", "Mystery", "Horror"
            ].map((genre) => (
              <div className="genre" key={genre}>
                <Link href={`/Genres/${genre}`} className="genre-item">{genre}</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;