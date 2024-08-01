"use client"; 

import React, { useState, MouseEvent, ReactNode } from 'react';


export default function Home({children}:{children:ReactNode}) {

    return(
        <div className="home-container " >
            {children}
        </div>
    )


}