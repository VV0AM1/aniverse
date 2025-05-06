import React, { useState } from "react";
import Card from "./Card";
import SkeletonCard from "./SkeletonCard";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer(){

    return(
        <div className="footer-containre w-full flex flex-col mt-12">
            <div className="footer-wrapper flex">
                <div className="footer-aniverse-container">
                    <div className="footer-info-container">
                        <h2>Aniverse</h2>
                        <p className="text-purple-400 text-sm mb-4">
                            アニメに関することなら何でも
                        </p>
                        <p className="text-footer leading-relaxed mb-2">
                        Your ultimate source for everything anime! Discover reviews, the latest recommendations,
                        fan-favorite characters, and exciting news and trivia. Dive into the world of anime with
                        us and find your next favorite series to enjoy!
                        </p>
                        <div className="flex justify-start space-x-4">
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
                </div>
                <div id="footer-col" className="footer-container-quick-links">
                    <h2>Quick Links</h2>
                    <div className="footer-links">
                    <a href="/" className="footer-link">Home</a>
                    <a href="/" className="footer-link">Me</a>
                    <a href="/Login" className="footer-link">Log-in</a>
                    </div>
                </div>
                <div id="footer-col" className="footer-pages">
                    <h2>Visit this:</h2>
                    <div className="footer-links">
                    <a href="/Manga" className="footer-link">Manga</a>
                    <a href="/Airinf" className="footer-link">Airing</a>
                    <a href="/Upcoming" className="footer-link">Upcoming</a>
                    <a href="/Trending" className="footer-link">Trending</a>
                    <a href="/Trending" className="footer-link">Home</a>
                    <a href="/Random" className="footer-link">Home</a>
                    </div>
                </div>
                <div id="footer-col" className="footer-socials">
                    <h2>Our Socials</h2>
                    <div className="footer-links">
                    <a href="#" aria-label="GitHub">
                                <FaGithub className="text-grey text-2xl hover:text-purple-400 transition mb-2" />
                            </a>
                            <a href="#" aria-label="LinkedIn">
                                <FaLinkedin className="text-grey text-2xl hover:text-purple-400 transition mb-2" />
                            </a>
                            <a href="#" aria-label="Instagram">
                                <FaInstagram className="text-grey text-2xl hover:text-purple-400 transition mb-2" />
                            </a>
                    </div>
                </div>
            </div>
            <div className="footer-additional-info">
                <p>2025 - Aniverse</p>
                <p>Powered by Jikan API</p>
            </div>
        </div>
    )

}

