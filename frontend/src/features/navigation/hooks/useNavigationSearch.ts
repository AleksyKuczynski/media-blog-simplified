// src/features/navigation/hooks/useNavigationSearch.ts
import { focusVisibleSearchInput } from '@/features/search/utils/searchFocus'

interface UseNavigationSearchParams {
  isSearchPage: boolean
  onOpenSearch?: () => void
}

export function useNavigationSearch({
  isSearchPage,
  onOpenSearch
}: UseNavigationSearchParams) {
  const handleSearchClick = () => {
    if (isSearchPage) {
      focusVisibleSearchInput()
    } else {
      onOpenSearch?.()
    }
  }

  return { handleSearchClick }
}