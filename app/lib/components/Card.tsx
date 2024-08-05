"use client"; 
import React, { useState, MouseEvent } from 'react';
import Image from 'next/image';


export default function Card({data}:{data:{title: string,
    decription: string,
    image:string}}) {
    
    return(
        <div className="card-container mx-12">
            <Image src={data?.image} width={195} height={370} alt="" className='w-[195px] h-[330px] brightness-60'/>
            <h2>{data.title}</h2>
            <p>{data.decription}</p>
        </div>
    )
}