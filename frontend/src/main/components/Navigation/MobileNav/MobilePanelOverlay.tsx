// src/main/components/Navigation/MobilePanelOverlay.tsx
// Unified overlay backdrop for mobile panels (menu and search)
// Uses consistent design: light overlay without blur

'use client'

import { useCallback } from 'react'

interface MobilePanelOverlayProps {
  onClose: () => void
}

export function MobilePanelOverlay({ onClose }: MobilePanelOverlayProps) {
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