"use client"; 

import { transform } from 'next/dist/build/swc';
import React, { useState, MouseEvent } from 'react';


const NavBar: React.FC = () =>  {

    const [isMenuVisible, setIsMenuVisible] = useState(false);

    const toggleMenu = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setIsMenuVisible(!isMenuVisible);
    }
    



    return (
    <>
        <nav className='header'>
            <div className="nav-btn-container">
                <ul>
                    <li><button id='nav-btn' onClick={toggleMenu}  className='nav-btn'  style={{
                    backgroundColor: isMenuVisible ? '#121316' : '#23252b'}}>Catalog</button></li>
                    <li><a href="#" className='nav-btn'>Shop</a></li>
                    <li><a href="#" className='nav-btn'>News</a></li>
                </ul>
            </div>
            <div className="nav-btn-container">
                <a href="#" className="logo">EliteAnimeAcademy</a>
            </div>
            <div className="nav-btn-container">
                <ul>
                    <li><a href="#" className='nav-btn'>S</a></li>
                    <li><a href="#" className='nav-btn'>Log-In</a></li>
                    <li><a href="#" className='nav-btn'>C</a></li>
                </ul>
            </div>
        </nav>
        <div className="menu" style={{
                                        maxHeight: isMenuVisible ? '370px' : '0px', 
                                        opacity: isMenuVisible ? 1 : 0,
                                        transform: isMenuVisible ? 'translateY(70px)' : 'translateY(60px)',
                                        transition: 'all 0.5s ease',
                                        overflow: 'hidden',
                                        }}>
            <div className="menu-bars">
                <div className='menu-item-container'><a href="" className='menu-item'>Trending</a></div>
                <div className='menu-item-container'><a href="" className='menu-item'>New In</a></div>
                <div className='menu-item-container'><a href="" className='menu-item'>Manga</a></div>
                <div className='menu-item-container'><a href="" className='menu-item'>Shopping</a></div>
            </div>
            <div className="right-menu">
                <div className="genre-title-container"><p className='genre-title'>GENRE</p></div>
                <div className="genre-bars">
                    <div className="genre"><a href="" className="genre-item">Action</a></div>
                    <div className="genre"><a href="" className="genre-item">Adventure</a></div>
                    <div className="genre"><a href="" className="genre-item">Comedy</a></div>
                    <div className="genre"><a href="" className="genre-item">Drama</a></div>
                    <div className="genre"><a href="" className="genre-item">Fantasy</a></div>
                    <div className="genre"><a href="" className="genre-item">Musition</a></div>
                    <div className="genre"><a href="" className="genre-item">Romantic</a></div>
                    <div className="genre"><a href="" className="genre-item">Si-Fi</a></div>
                    <div className="genre"><a href="" className="genre-item">Seinen</a></div>
                    <div className="genre"><a href="" className="genre-item">Shojo</a></div>
                    <div className="genre"><a href="" className="genre-item">Senen</a></div>
                    <div className="genre"><a href="" className="genre-item">Humdrum</a></div>
                    <div className="genre"><a href="" className="genre-item">Sport</a></div>
                    <div className="genre"><a href="" className="genre-item">Mystic</a></div>
                    <div className="genre"><a href="" className="genre-item">Triller</a></div>
                </div>
            </div>
        </div>
    </>
    );

}

export default NavBar