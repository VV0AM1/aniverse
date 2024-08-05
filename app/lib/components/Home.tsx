"use client"; 

import React, { useState, MouseEvent, ReactNode } from 'react';


export default function Home({children}:{children:ReactNode}) {

    return(
        <div className="home-container flex h-100 w-100 justify-center items-center" >
            {children}
        </div>
    )


}