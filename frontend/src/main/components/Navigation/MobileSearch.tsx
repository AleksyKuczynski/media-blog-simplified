// src/main/components/Navigation/MobileSearch.tsx
// Mobile search interface sliding from RIGHT
// Uses unified useMobilePanel hook with mobile-optimized search content

'use client'

import { MobilePanelOverlay } from './MobilePanelOverlay'
import { useMobilePanel } from './useMobilePanel'
import { Dictionary, Lang } from '@/main/lib/dictionary/types'
import MobileSearchContent from '../Search/MobileSearchContent'

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
    panelState: searchState,
    isPanelOpen: isSearchOpen,
    panelRef: searchRef,
    toggleRef,
    togglePanel: toggleSearch,
    handleClose,
    handleContentComplete: handleSearchComplete,
    handlePanelClick: handleSearchClick,
    transformClasses: searchTransform
  } = useMobilePanel({
    side: 'right',
    panelId: 'mobile-search-content',
    historyStateKey: 'mobileSearchOpen',
    onOtherPanelOpen: onMenuClose, // Close menu when search opens
    focusSelector: 'input[type="text"], input[type="search"]'
  })
  
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

      {/* Search Overlay - Same as menu */}
      {isSearchOpen && <MobilePanelOverlay onClose={() => handleClose(false)} />}

      {/* Slide-out Search Panel */}
      <div
        ref={searchRef}
        id="mobile-search-content"
        onClick={handleSearchClick}
        className={`
          fixed top-16 left-0 right-0 bottom-0 z-[60] pointer-events-auto
          bg-sf-cont/95 backdrop-blur-lg border-b border-ol-var/20
          transform transition-transform duration-300 ease-in-out
          ${searchTransform}
        `}
        aria-hidden={!isSearchOpen}
        aria-label={dictionary.search.accessibility.searchLabel || 'Search'}
      >
        {/* Mobile Search Content - Only render when open for better performance */}
        {isSearchOpen && (
          <MobileSearchContent
            dictionary={dictionary}
            lang={lang}
            onSearchComplete={handleSearchComplete}
          />
        )}
      </div>
    </>
  )
}