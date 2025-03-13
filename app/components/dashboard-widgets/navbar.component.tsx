"use client"

import Link from 'next/link';
import { useState } from 'react';
import FitbitSharpIcon from '@mui/icons-material/FitbitSharp';

import '../components.css';

const Tab = ({ href, label, isSelected }: { href: string, label: string, isSelected: boolean}) => {
    return (
    <Link href={href}
        className={`tab ${isSelected && 'selected tab'}`}
        onClick={(e) => {
            e.preventDefault(); // Prevent default Link behavior
            window.location.replace(href)
        }}>
        {label}
    </Link>
    );
};

export default function NavBar() {
  const [tabs, setTabs] = useState(
    [{ href: '/counts', label: 'Comptes' }]);
  const [currentPageHref, setCurrentPageHref] = useState('/dashboard');

  const removeTab = (href: string) => {
    setTabs(tabs.filter((tab) => tab.href !== href));
  };

  const handleTabClick = (href: string) => {
    setCurrentPageHref(href);
  };

  return (
    <div className='navbar'>
      <Link href='/dashboard'
          onClick={() => handleTabClick('/dashboard')}> 
        <span className="actions-wrapper">
          <FitbitSharpIcon></FitbitSharpIcon>
        </span>
      </Link>

      {tabs.map((tab, key) => (
        <Tab
          key={key}
          href={tab.href}
          label={tab.label}
          isSelected={tab.href === currentPageHref}
        />
      ))}
    </div>
  );
}
