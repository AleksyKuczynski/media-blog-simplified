// src/main/components/Navigation/MobileSearch.tsx
// Mobile search interface with button and slide-out panel from right

'use client'

import { MobileSearchOverlay } from './MobileSearchOverlay'
import { useMobileSearch } from './useMobileSearch'
import { Dictionary, Lang } from '@/main/lib/dictionary/types'
import SearchBarClient from '../Search/SearchBarClient'

interface MobileSearchProps {
  dictionary: Dictionary
  lang: Lang
  onMenuClose: () => void
}

export default function MobileSearch({
  dictionary,
  lang,
  onMenuClose,
}: MobileSearchProps) {
  const {
    searchState,
    isSearchOpen,
    searchRef,
    toggleRef,
    toggleSearch,
    handleClose,
    handleSearchComplete,
    handleSearchClick,
  } = useMobileSearch(onMenuClose)
  
  return (
    <>
      {/* Search Button - Top Right */}
      <button
        ref={toggleRef}
        onClick={toggleSearch}
        aria-expanded={isSearchOpen}
        aria-controls="mobile-search-content" 
        aria-label={
          isSearchOpen 
            ? dictionary.search.accessibility.closeSearch || 'Close search'
            : dictionary.search.accessibility.openSearch || 'Open search'
        }
        className="
          p-3 rounded-full bg-sf-hi hover:bg-sf-hst text-on-sf 
          transition-all duration-200 
          active:scale-95 touch-manipulation
        "
        type="button"
      >
        <div className="w-6 h-6 flex items-center justify-center">
          {isSearchOpen ? (
            // Close icon
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Search icon
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </button>

      {/* Search Overlay */}
      {isSearchOpen && <MobileSearchOverlay onClose={handleClose} />}

      {/* Slide-out Search Panel from Right */}
      <div
        ref={searchRef}
        id="mobile-search-content"
        onClick={handleSearchClick}
        className={`
          fixed top-16 right-0 bottom-0 left-0 z-[60] pointer-events-auto
          bg-sf-cont/95 backdrop-blur-lg border-b border-ol-var/20
          transform transition-transform duration-300 ease-in-out
          ${searchState === 'FULLY_OPENED' ? 'translate-x-0' : 'translate-x-full'}
        `}
        aria-hidden={!isSearchOpen}
        aria-label={dictionary.search.accessibility.searchLabel || 'Search'}
      >
        <div className="flex flex-col h-full">
          {/* Search Header */}
          <div className="px-6 py-4 border-b border-ol-var/20">
            <h2 className="text-lg font-semibold text-on-sf">
              {dictionary.search.labels.title || 'Search'}
            </h2>
          </div>

          {/* Search Interface */}
          <div className="flex-1 px-6 py-6 overflow-y-auto" data-interactive="true">
            <SearchBarClient
              dictionary={dictionary}
              lang={lang}
              onSearchComplete={handleSearchComplete}
              className="search-container"
            />
          </div>
        </div>
      </div>
    </>
  )
}