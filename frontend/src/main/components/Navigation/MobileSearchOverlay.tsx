// src/main/components/Navigation/MobileSearchOverlay.tsx
// Overlay backdrop for mobile search panel

'use client'

import { useCallback } from 'react'

interface MobileSearchOverlayProps {
  onClose: () => void;
}

export function MobileSearchOverlay({ onClose }: MobileSearchOverlayProps) {
  const handleClick = useCallback((e: React.MouseEvent) => {
    // Only close if clicking directly on the overlay background
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  return (
    <div
      onClick={handleClick}
      className="fixed inset-0 bg-black/10 z-[45] pointer-events-auto"
      aria-hidden="true"
      role="presentation"
    />
  )
}