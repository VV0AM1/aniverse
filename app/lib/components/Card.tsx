"use client"; 
import React, { useState, MouseEvent } from 'react';
import Image from 'next/image';


export default function Card({data}:{data:{title: string,
    decription: string,
    image:string}}) {
    
    return(
        <div className="card-container mx-12">
            <Image src={data?.image} width={280} height={520} alt="" className='w-[280px] h-[520px]'/>
            <h2>{data.title}</h2>
            <p>{data.decription}</p>
        </div>
    )
}