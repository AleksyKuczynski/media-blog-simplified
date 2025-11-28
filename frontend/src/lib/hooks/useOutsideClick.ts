// src/main/lib/hooks/useOutsideClick.ts

import { RefObject, useEffect } from "react"

export function useOutsideClick<T extends HTMLElement>(
  ref: RefObject<T | null>,
  toggleRef: RefObject<HTMLElement | null> | null,
  isOpen: boolean,
  onClose: (event?: MouseEvent | TouchEvent) => void
): void {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      
      if (!ref.current?.contains(target) && 
          (!toggleRef?.current?.contains(target)) && 
          isOpen) {
        onClose(event)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('touchstart', handleClickOutside)
        document.removeEventListener('keydown', handleEscapeKey)
      }
    }
  }, [isOpen, onClose, ref, toggleRef])
}
