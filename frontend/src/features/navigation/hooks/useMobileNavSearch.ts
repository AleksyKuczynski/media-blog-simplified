// src/features/navigation/hooks/useMobileNavSearch.ts
import { useImperativeHandle, Ref } from 'react'
import { useNavigationSearch } from './useNavigationSearch'

interface UseMobileNavSearchParams {
  isSearchPage: boolean
  toggleSearch: () => void
  ref: Ref<{ openSearch: () => void }>
}

export function useMobileNavSearch({
  isSearchPage,
  toggleSearch,
  ref
}: UseMobileNavSearchParams) {
  // Expose search control to parent
  useImperativeHandle(ref, () => ({
    openSearch: toggleSearch
  }))

  // Handle search button click
  const { handleSearchClick } = useNavigationSearch({
    isSearchPage,
    onOpenSearch: toggleSearch
  })

  return { handleSearchClick }
}