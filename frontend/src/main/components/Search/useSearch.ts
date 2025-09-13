// src/main/components/Search/useSearch.ts
import { useState, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { SearchProposition } from '@/main/lib/directus'
import { getSearchSuggestions } from '@/main/lib/actions'
import { createSearchUrl } from '@/main/lib/utils'
import { SearchStatus } from './types'
import { Lang } from '@/main/lib/dictionary/types'

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchProposition[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchStatus, setSearchStatus] = useState<SearchStatus>({ type: 'idle' })
  
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSelect = useCallback(async (articleSlug: string, rubricSlug: string) => {
    const lang = pathname.split('/')[1] as Lang
    // Reset states
    setSearchQuery('')
    setSuggestions([])
    setSearchStatus({ type: 'idle' })
    // Navigate to the selected article
    router.push(`/${lang}/${rubricSlug}/${articleSlug}`)
  }, [pathname, router])

  const handleSearchSubmit = useCallback((): boolean => {
    const trimmedQuery = searchQuery.trim()
    if (trimmedQuery.length >= 3) {
      const lang = pathname.split('/')[1] as Lang
      const searchUrl = createSearchUrl(trimmedQuery, searchParams)
      router.push(`/${lang}${searchUrl}`)
      setSearchQuery('')
      setSuggestions([])
      setSearchStatus({ type: 'idle' })
      return true
    }
    return false
  }, [searchQuery, pathname, router, searchParams])

  const handleSearch = useCallback(async (term: string): Promise<SearchProposition[]> => {
    if (term.length >= 3) {
      setIsSearching(true);
      setSearchStatus({ type: 'searching' });
      
      try {
        const results = await getSearchSuggestions(term, pathname.split('/')[1] as Lang);
        setSuggestions(results);
        return results;
      } finally {
        setIsSearching(false);
      }
    }
    return [];
  }, [pathname]);

  // Animation-related states
  const shouldShowContent = searchStatus.type !== 'idle'
  const hasValidContent = suggestions.length > 0
  const isTransitioning = isSearching

  return {
    // Search functionality
    searchQuery,
    suggestions,
    isSearching,
    searchStatus,
    setSearchQuery,
    setSuggestions,
    handleSearch,
    handleSearchSubmit,
    handleSelect, // Added handleSelect to the return object

    // Animation-related states
    animation: {
      shouldShowContent,
      hasValidContent,
      isTransitioning,
      searchStatus,
    }
  }
}