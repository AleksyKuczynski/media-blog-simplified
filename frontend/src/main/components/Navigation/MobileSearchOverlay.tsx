// src/main/components/Navigation/MobileSearchOverlay.tsx
// Overlay backdrop for mobile search panel
// CORRECTED: Blurs PAGE CONTENT, covers full viewport height including behind nav bar

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
      // CORRECTED: 
      // - fixed inset-0: Covers ENTIRE viewport (including behind nav bar)
      // - bg-black/30: 30% opacity for visible darkening
      // - backdrop-blur-sm: Blurs the PAGE CONTENT behind the overlay
      // - z-[45]: Behind nav bar (z-50) but above page content
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[45] pointer-events-auto"
      aria-hidden="true"
      role="presentation"
    />
  )
}