"use client";

import React, { useState, useEffect } from "react";
import { animeServices } from "@/app/lib/services/animes";
import Link from "next/link";

const NavBar: React.FC = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    setSearchQuery("");
    setSearchResults([]);
  };

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
          <button
            id="nav-btn"
            onClick={toggleMenu}
            className="nav-btn"
            style={{
              backgroundColor: isMenuVisible ? "#121316" : "#23252b",
            }}
          >
            Catalog
          </button>
          <a href="#" className="nav-btn">
            Shop
          </a>
          <a href="#" className="nav-btn">
            News
          </a>
        </div>
        <div className="menu-container">
          <a href="/" className="logo">
            AniBook.
          </a>
        </div>
        <div className="nav-btn-container">
          <button className="nav-btn" onClick={toggleSearch}>
            <img src="/img/search.svg" alt="Search" />
          </button>
          <a href="#" className="nav-btn">
            Log-In
          </a>
          <a href="#" className="nav-btn">
            <img src="/img/shopping-cart.svg" alt="Cart" />
          </a>
        </div>
      </nav>

      {isSearchVisible && (
        <div
          className="search-box"
          style={{
            position: "absolute",
            top: "100px",
            right: "90px",
            width: "450px",
            backgroundColor: "#121316",
            padding: "10px",
            borderRadius: "5px",
            zIndex: 100,
            boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
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
          {loading && <p style={{ color: "#fff" }}>Loading...</p>}
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
                    href={`/Anime?mal_id=${encodeURIComponent(anime.mal_id)}&title=${encodeURIComponent(anime.title)}&episodes=${anime.episodes}&image_url=${encodeURIComponent(
                      anime.images.jpg.large_image_url
                    )}&synopsis=${encodeURIComponent(anime.synopsis)}&score=${anime.score}&year=${anime.year}&genres=${encodeURIComponent(
                      anime.genres.map((g: any) => g.name).join(", ")
                    )}&producers=${encodeURIComponent(
                      anime.producers.map((p: any) => p.name).join(", ")
                    )}&studios=${encodeURIComponent(
                      anime.studios.map((s: any) => s.name).join(", ")
                    )}&trailerImageUrl=${encodeURIComponent(
                      anime.trailer.images.medium_image_url
                    )}&trailerUrl=${encodeURIComponent(anime.trailer.url)}&rating=${anime.rating}&scored_by=${anime.scored_by}`}
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
        </div>
      )}
      <div
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
          <div className="menu-item-container">
            <a href="/Trending" className="menu-item">
              Trending
            </a>
          </div>
          <div className="menu-item-container">
            <a href="/Airing" className="menu-item">
              Airing
            </a>
          </div>
          <div className="menu-item-container">
            <a href="" className="menu-item">
              Manga
            </a>
          </div>
          <div className="menu-item-container">
            <a href="" className="menu-item">
              Shopping
            </a>
          </div>
        </div>
            <div className="right-menu">
                <div className="genre-menu-title-container"><p className='genre-menu-title'>GENRE</p></div>
                <div className="genre-bars">
                  <div className="genre"><Link href="/Genres/Action" className="genre-item">Action</Link></div>
                  <div className="genre"><Link href="/Genres/Adventure" className="genre-item">Adventure</Link></div>
                  <div className="genre"><Link href="/Genres/Comedy" className="genre-item">Comedy</Link></div>
                  <div className="genre"><Link href="/Genres/Drama" className="genre-item">Drama</Link></div>
                  <div className="genre"><Link href="/Genres/Fantasy" className="genre-item">Fantasy</Link></div>
                  <div className="genre"><Link href="/Genres/Music" className="genre-item">Music</Link></div>
                  <div className="genre"><Link href="/Genres/Romance" className="genre-item">Romantic</Link></div>
                  <div className="genre"><Link href="/Genres/Sci-Fi" className="genre-item">Si-Fi</Link></div>
                  <div className="genre"><Link href="/Genres/Seinen" className="genre-item">Seinen</Link></div>
                  <div className="genre"><Link href="/Genres/Shoujo" className="genre-item">Shoujo</Link></div>
                  <div className="genre"><Link href="/Genres/Isekai" className="genre-item">Isekai</Link></div>
                  <div className="genre"><Link href="/Genres/Erotica" className="genre-item">Erotica</Link></div>
                  <div className="genre"><Link href="/Genres/Sports" className="genre-item">Sport</Link></div>
                  <div className="genre"><Link href="/Genres/Mystery" className="genre-item">Mystery</Link></div>
                  <div className="genre"><Link href="/Genres/Horror" className="genre-item">Horror</Link></div>
                </div>
            </div>
        </div>
    </>
    );

}

export default NavBar