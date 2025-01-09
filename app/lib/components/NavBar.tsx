"use client";

import React, { useState, MouseEvent } from "react";
import { animeServices } from "@/app/lib/services/animes";

const NavBar: React.FC = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleMenu = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsMenuVisible(!isMenuVisible);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);

    try {
      const response = await animeServices.all(); 
      if (response.status === 200) {
        const results = response.data.data.filter((anime: any) =>
          anime.title.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

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
            EliteAnimeAcademy
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
            top: "70px",
            left: "10px",
            width: "300px",
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
            onChange={handleSearch}
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
                anime.genres.map((g:any) => g.name).join(', ')
            )}&producers=${encodeURIComponent(
                anime.producers.map((p:any) => p.name).join(', ')
            )}&studios=${encodeURIComponent(
                anime.studios.map((s:any) => s.name).join(', ')
            )}&trailerImageUrl=${encodeURIComponent(
                anime.trailer.images.medium_image_url
            )}&trailerUrl=${encodeURIComponent(anime.trailer.url)}&rating=${anime.rating}&scored_by=${anime.scored_by}`}
                    style={{
                      display: "block",
                      padding: "5px 0",
                      color: "#1e90ff",
                      textDecoration: "none",
                    }}
                  >
                    {anime.image_url}
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
            <a href="http://localhost:3000/Trending" className="menu-item">
              Trending
            </a>
          </div>
          <div className="menu-item-container">
            <a href="" className="menu-item">
              New In
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
                    <div className="genre"><a href="/Genres/Action" className="genre-item">Action</a></div>
                    <div className="genre"><a href="/Genres/Adventure" className="genre-item">Adventure</a></div>
                    <div className="genre"><a href="/Genres/Comedy" className="genre-item">Comedy</a></div>
                    <div className="genre"><a href="/Genres/Drama" className="genre-item">Drama</a></div>
                    <div className="genre"><a href="/Genres/Fantasy" className="genre-item">Fantasy</a></div>
                    <div className="genre"><a href="/Genres/Music" className="genre-item">Music</a></div>
                    <div className="genre"><a href="/Genres/Romance" className="genre-item">Romantic</a></div>
                    <div className="genre"><a href="/Genres/Sci-Fi" className="genre-item">Si-Fi</a></div>
                    <div className="genre"><a href="/Genres/Seinen" className="genre-item">Seinen</a></div>
                    <div className="genre"><a href="/Genres/Shoujo" className="genre-item">Shoujo</a></div>
                    <div className="genre"><a href="/Genres/Isekai" className="genre-item">Isekai</a></div>
                    <div className="genre"><a href="/Genres/Erotica" className="genre-item">Erotica</a></div>
                    <div className="genre"><a href="/Genres/Sports" className="genre-item">Sport</a></div>
                    <div className="genre"><a href="/Genres/Mystery" className="genre-item">Mystery</a></div>
                    <div className="genre"><a href="/Genres/Horror" className="genre-item">Horror</a></div>
                </div>
            </div>
        </div>
    </>
    );

}

export default NavBar