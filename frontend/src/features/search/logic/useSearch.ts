// src/main/components/Search/useSearch.ts
import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SearchResult } from '@/api/directus'
import { Lang } from '@/config/i18n'
import { SearchStatus } from '../types'
import { createSearchUrl } from '../utils/createSearchUrl'
import { getSearchSuggestions } from '../actions/getSearchSuggestions'

interface UseSearchProps {
  lang: Lang;
}

export function useSearch({ lang }: UseSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchStatus, setSearchStatus] = useState<SearchStatus>({ type: 'idle' })
  
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSelect = useCallback(async (articleSlug: string, rubricSlug: string) => {
    // Reset states
    setSearchQuery('')
    setSuggestions([])
    setSearchStatus({ type: 'idle' })
    // Navigate to the selected article
    router.push(`/${lang}/${rubricSlug}/${articleSlug}`)
  }, [lang, router])

  const handleSearchSubmit = useCallback((): boolean => {
    const trimmedQuery = searchQuery.trim()
    if (trimmedQuery.length >= 3) {
      const searchUrl = createSearchUrl(trimmedQuery, searchParams)
      router.push(`/${lang}${searchUrl}`)
      setSearchQuery('')
      setSuggestions([])
      setSearchStatus({ type: 'idle' })
      return true
    }
    return false
  }, [searchQuery, lang, router, searchParams])

  const handleSearch = useCallback(async (term: string): Promise<SearchResult[]> => {
    if (term.length >= 3) {
      setIsSearching(true);
      setSearchStatus({ type: 'searching' });
      
      try {
        const results = await getSearchSuggestions(term, lang);
        setSuggestions(results);
        return results;
      } finally {
        setIsSearching(false);
      }
    }
    return [];
  }, [lang]);

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
    handleSelect,

    // Animation-related states
    animation: {
      shouldShowContent,
      hasValidContent,
      isTransitioning,
      searchStatus,
    }
  }
}