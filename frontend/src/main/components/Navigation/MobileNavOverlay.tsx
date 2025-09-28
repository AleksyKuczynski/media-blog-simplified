// src/main/components/Navigation/MobileNavOverlay.tsx
// FIXED: Proper z-index and click handling to work with menu content

'use client'

import { useCallback } from 'react'

interface MobileNavOverlayProps {
  onClose: () => void;
}

export function MobileNavOverlay({ onClose }: MobileNavOverlayProps) {
  const handleClick = useCallback((e: React.MouseEvent) => {
    // Only close if clicking directly on the overlay background
    // Not on any child elements (though this overlay shouldn't have any)
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  return (
    <div
      onClick={handleClick}
      className="fixed inset-0 bg-black/10 z-[45] pointer-events-auto" // FIXED: Lower z-index than menu content
      aria-hidden="true"
      role="presentation" // Added for better accessibility
    />
  )
}