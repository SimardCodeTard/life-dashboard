'use client';

import { Contrast, DarkMode, KeyboardArrowLeft, LightMode, SettingsSuggest } from '@mui/icons-material'
import './theme-selector.scss'
import { useState } from 'react'

export default function ThemeSelector () {
    const [themeOptions] = useState([
        {name: 'light', selectorNode: <span>
          <LightMode></LightMode> light
        </span>}, 
        {name: 'dark', selectorNode: <span>
          <DarkMode></DarkMode> dark
        </span>}, 
        {name: 'system', selectorNode: <span>
          <SettingsSuggest></SettingsSuggest> system
        </span>}]
      );
    
    return <div tabIndex={-3} className="theme-selector actions-wrapper">
        <Contrast></Contrast> <p>Select theme</p>
    </div>
}