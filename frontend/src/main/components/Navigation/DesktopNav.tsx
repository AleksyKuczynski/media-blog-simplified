// src/main/components/Navigation/DesktopNav.tsx
'use client';

import React from 'react';
import { NavProps } from './Navigation';
import Logo from '../Logo';
import NavLinks from './NavLinks';
import ExpandableSearch from '../Search/ExpandableSearch';

// ✅ SIMPLIFIED: Only 'rounded' theme styles (will be hardcoded later)
const linkStylesValues = {
  default: 'px-3 py-2 font-medium tracking-wider',
  rounded: 'px-4 py-2 rounded-full font-medium',
  sharp: 'px-3 py-2 border-b-2 border-transparent uppercase font-medium text-sm',
};

export default function DesktopNavigation({
  lang,
  translations,
}: NavProps) {


  return (
    <nav className="hidden xl:block fixed top-0 left-0 right-0 z-50 backdrop-blur-lg transition-all duration-300">
      <div className="grid grid-cols-3 items-center h-24">
        <ul className="flex items-center justify-start pl-8">
          <NavLinks 
            lang={lang} 
            translations={translations.navigation} 
          />
        </ul>

        <div className="flex items-center justify-center">
          <Logo lang={lang} variant="desktop" />
        </div>
        <div className="flex items-center justify-end space-x-4 pr-8">
          <ExpandableSearch searchTranslations={translations.search} lang={lang}/>
        </div>
      </div>
    </nav>
  );
}