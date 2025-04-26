'use client';

import { KeyboardTab } from '@mui/icons-material';
import './side-bar.scss';
import { useState } from 'react';
import Link from 'next/link';

export default function SideBar() {

    const [deployed, setDeployed] = useState(true);

    return <div className={`side-bar ${deployed && 'deployed'}`}>
        <span className='side-bar-header'>
            <Link href={'/dashboard'}>Home</Link>
            <KeyboardTab className='deploy-icon' onClick={() => setDeployed(!deployed)}></KeyboardTab>
        </span>
        
    </div>
}