// src/main/components/Navigation/DesktopNav.tsx - Ultra-simplified
'use client';

import React from 'react';
import { NavProps } from './Navigation';
import Logo from '../Logo';
import NavLinks from './NavLinks';
import ExpandableSearch from '../Search/ExpandableSearch';
// ✅ REMOVED: All theme imports - using direct Tailwind classes

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
            linkStyles="px-4 py-2 rounded-full font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200" 
            // ✅ DIRECT TAILWIND: No more complex theme system
          />
        </ul>

        <div className="flex items-center justify-center">
          <Logo lang={lang} variant="desktop" />
        </div>
        
        <div className="flex items-center justify-end space-x-4 pr-8">
          <ExpandableSearch searchTranslations={translations.search} lang={lang}/>
          {/* ✅ OPTION: Remove color scheme selector entirely, or keep minimal version */}
          {/* <ColorSchemeSwitcher colorTranslations={translations.colors} /> */}
        </div>
      </div>
    </nav>
  );
}