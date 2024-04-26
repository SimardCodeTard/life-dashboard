'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import FitbitSharpIcon from '@mui/icons-material/FitbitSharp';
import { TabPropsType } from "@/app/types/navbar.type";

export const Tab = ({ href, label, isHome }: TabPropsType) => {
    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
        setIsSelected(window.location.href.split('/')[1] === href);
    }, [setIsSelected, window.location.href])

    const handleTabClick = () => {
        window.location.replace(href);
    }

    return isHome 
    ? (
        <Link href='/dashboard'
            onClick={() => handleTabClick()} 
            className='flex items-center mr-4'
        ><FitbitSharpIcon></FitbitSharpIcon>
        </Link>
    ) : (
        <Link href={href}
            className={`
                flex items-center text-lg font-medium 
                ${isSelected ? 'bg-[rgba(20,20,20,0.4)] shadow-inner' : 'bg-[rgba(70,70,70,0.2)] shadow-lg'}  
                p-2 px-4
            `}
            onClick={(e) => {
                e.preventDefault();
                window.location.replace(href)
            }}>
            {label}
        </Link>
    );
};