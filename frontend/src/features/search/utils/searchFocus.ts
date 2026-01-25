// src/features/search/utils/searchFocus.ts

/**
 * Finds and focuses the visible search input on the page.
 * Excludes inputs that are inside aria-hidden containers (e.g., mobile offcanvas).
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
      return true
    })
    
    if (searchInput) {
      searchInput.focus()
    }
  })
}