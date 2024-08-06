"use client"; 
import React, { useState, MouseEvent } from 'react';
import Image from 'next/image';


export default function Card({data}:{data:{title: string,
    decription: string,
    images:{jpg:{image_url:string, large_image_url:string, small_image_url:string},wepp:{image_url:string, large_image_url:string, small_image_url:string}}}}) {
    
    return(
        <div className="card-container px-12 py-6">
            <Image src={data?.images?.jpg.image_url} width={195} height={370} alt="" className='w-[195px] h-[330px] brightness-60'/>
            <h2 style={{maxWidth: 195, textAlign: 'center',color: 'white'}}>{data.title}</h2>
            <p>{data.decription}</p>
        </div>
    )
}