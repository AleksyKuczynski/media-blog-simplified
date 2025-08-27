// src/main/components/Navigation/DesktopNav.tsx - FINAL CLEAN VERSION
'use client';

import React from 'react';
import { NavProps } from './Navigation';
import Logo from '../Logo';
import NavLinks from './NavLinks';
import ExpandableSearch from '../Search/ExpandableSearch';

export default function DesktopNavigation({
  lang,
  translations,
}: NavProps) {
  return (
    <nav className="hidden xl:block fixed top-0 left-0 right-0 z-50 bg-sf-cont/80 backdrop-blur-lg border-b border-ol-var/20 transition-all duration-300">
      <div className="grid grid-cols-3 items-center h-24 max-w-7xl mx-auto px-6">
        
        {/* Left: Navigation Links */}
        <ul className="flex items-center justify-start space-x-2">
          <NavLinks 
            lang={lang} 
            translations={translations.navigation} 
            linkStyles="px-4 py-2 rounded-full font-medium text-on-sf-var hover:text-on-sf hover:bg-sf-hi transition-all duration-200"
          />
        </ul>

        {/* Center: Logo */}
        <div className="flex items-center justify-center">
          <Logo lang={lang} variant="desktop" />
        </div>
        
        {/* Right: Search and Optional Color Switcher */}
        <div className="flex items-center justify-end space-x-4">
          <ExpandableSearch 
            searchTranslations={translations.search} 
            lang={lang}
          />
          
          {/* Optional: Simple Dark/Light Mode Toggle */}
          <button
            className="p-2 rounded-full bg-sf-hi hover:bg-sf-hst text-on-sf transition-all duration-200"
            onClick={() => document.documentElement.classList.toggle('dark')}
            aria-label="Toggle dark mode"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}