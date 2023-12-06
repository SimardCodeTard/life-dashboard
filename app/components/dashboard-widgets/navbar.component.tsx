"use client"

import Link from 'next/link';
import { useState } from 'react';
import FitbitSharpIcon from '@mui/icons-material/FitbitSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';

const Tab = ({ href, label, isSelected, onClose }: { href: string, label: string, isSelected: boolean, onClose: (href: string) => void}) => {
    return (
    <Link href={href}
        className={`
            flex items-center text-lg font-medium 
            ${isSelected ? 'bg-[rgba(20,20,20,0.4)] shadow-inner' : 'bg-[rgba(70,70,70,0.2)] shadow-lg'}  
            p-2 px-4
        `}
        onClick={(e) => {
            e.preventDefault(); // Prevent default Link behavior
            window.location.replace(href)
        }}>
        {label}
        <CloseSharpIcon onClick={() => onClose(href)} className='ml-2 text-[rgba(255,255,255,0.5)]'></CloseSharpIcon>   
    </Link>
    );
};

export default function NavBar() {
  const [tabs, setTabs] = useState([{ href: '/stats', label: 'Stats' }]);
  const [currentPageHref, setCurrentPageHref] = useState('/dashboard');

  const removeTab = (href: string) => {
    setTabs(tabs.filter((tab) => tab.href !== href));
  };

  const handleTabClick = (href: string) => {
    setCurrentPageHref(href);
  };

  return (
    <div className='navbar w-[100vw] h-14 bg-[var(--background-navbar)] shadow-xl flex items-center p-1 px-4 space-x-2'>
      <Link href='/dashboard'
          onClick={() => handleTabClick('/dashboard')} 
          className='flex items-center mr-4'
        ><FitbitSharpIcon></FitbitSharpIcon>
      </Link>

      {tabs.map((tab, key) => (
        <Tab
          key={key}
          href={tab.href}
          label={tab.label}
          isSelected={tab.href === currentPageHref}
          onClose={removeTab}
        />
      ))}
    </div>
  );
}
