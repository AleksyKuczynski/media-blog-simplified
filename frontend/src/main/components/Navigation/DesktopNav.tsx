// src/main/components/Navigation/DesktopNav.tsx - SEO-Enhanced Desktop Navigation
'use client';

import React from 'react';
import { NavProps } from './Navigation';
import Logo from '../Logo';
import NavLinks from './NavLinks';
import ExpandableSearch from '../Search/ExpandableSearch';

export default function DesktopNavigation({
  lang,
  translations,
  currentPageTitle,
}: NavProps) {
  return (
    <nav 
      id="main-navigation"
      className="hidden xl:block bg-sf-cont/80 backdrop-blur-lg border-b border-ol-var/20 transition-all duration-300"
      aria-label="Главная навигация"
      role="navigation"
      itemScope
      itemType="https://schema.org/SiteNavigationElement"
    >
      <div className="grid grid-cols-3 items-center h-24 max-w-7xl mx-auto px-6">
        
        {/* Left: Primary Navigation Links */}
        <div 
          className="flex items-center justify-start"
          role="group"
          aria-label="Основные разделы сайта"
        >
          <ul 
            className="flex items-center justify-start space-x-2"
            role="menubar"
            aria-label="Главное меню"
          >
            <NavLinks 
              lang={lang} 
              translations={translations.navigation} 
              linkStyles="px-4 py-2 rounded-full font-medium text-on-sf-var hover:text-on-sf hover:bg-sf-hi transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              role="menuitem"
            />
          </ul>
        </div>

        {/* Center: Logo/Brand */}
        <div 
          className="flex items-center justify-center"
          itemProp="mainEntity"
          itemScope
          itemType="https://schema.org/Organization"
        >
          <Logo 
            lang={lang} 
            variant="desktop"
            role="img"
            aria-label="EventForMe - главная страница"
          />
        </div>
        
        {/* Right: Utility Navigation */}
        <div 
          className="flex items-center justify-end space-x-4"
          role="group"
          aria-label="Поиск и настройки"
        >
          {/* Enhanced Search */}
          <div 
            id="site-search"
            role="search"
            aria-label="Поиск по сайту"
          >
            <ExpandableSearch 
              searchTranslations={translations.search} 
              lang={lang}
              aria-label={translations.search.placeholder}
            />
          </div>
          
          {/* Theme Toggle with better accessibility */}
          <button
            className="p-3 rounded-full bg-sf-hi hover:bg-sf-hst text-on-sf transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={() => document.documentElement.classList.toggle('dark')}
            aria-label="Переключить темную тему"
            aria-pressed="false"
            title="Переключить между светлой и темной темой"
            type="button"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
              />
            </svg>
            <span className="sr-only">
              Переключить между светлой и темной темой оформления
            </span>
          </button>
        </div>
      </div>
      
      {/* Current page context for screen readers */}
      {currentPageTitle && (
        <div className="sr-only" aria-live="polite">
          Текущая страница: {currentPageTitle}
        </div>
      )}
    </nav>
  );
}