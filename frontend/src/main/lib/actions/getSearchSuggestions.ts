// src/main/lib/actions/getSearchSuggestions.ts
'use server'

import { Lang } from "../dictionary"
import { fetchSearchPropositions, SearchResult } from "../directus"

export async function getSearchSuggestions(query: string, lang: Lang): Promise<SearchResult[]> {
  if (query.length < 3) return []
  return await fetchSearchPropositions(query, lang)
}