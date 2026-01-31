// src/features/search/utils/searchFocus.ts

/**
 * Finds and focuses the visible search input on the page.
 * Excludes inputs that are inside aria-hidden containers (e.g., mobile offcanvas)
 * or hidden by CSS classes.
 */
export function focusVisibleSearchInput(): void {
  requestAnimationFrame(() => {
    const allInputs = document.querySelectorAll<HTMLInputElement>('#search-bar-input')
    const searchInput = Array.from(allInputs).find(input => {
      // Check if input or any parent has aria-hidden="true"
      let element: HTMLElement | null = input
      while (element) {
        if (element.getAttribute('aria-hidden') === 'true') {
          return false
        }
        element = element.parentElement
      }
      
      // Check if input is actually visible (not hidden by Tailwind classes)
      const rect = input.getBoundingClientRect()
      const isVisible = rect.width > 0 && rect.height > 0 && 
                       window.getComputedStyle(input).display !== 'none' &&
                       window.getComputedStyle(input).visibility !== 'hidden'
      
      return isVisible
    })
    
    if (searchInput) {
      searchInput.focus()
    }
  })
}