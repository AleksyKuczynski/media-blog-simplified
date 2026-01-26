// src/features/navigation/MobileNav/MobilePanelOverlay.tsx
'use client'

import { useCallback } from 'react'
import { PANEL_OVERLAY_STYLES } from '../navigation.styles'

interface MobilePanelOverlayProps {
  onClose: () => void
}

export function MobilePanelOverlay({ onClose }: MobilePanelOverlayProps) {
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  return (
    <div
      onClick={handleClick}
      className={PANEL_OVERLAY_STYLES.overlay}
      aria-hidden="true"
      role="presentation"
    />
  )
}