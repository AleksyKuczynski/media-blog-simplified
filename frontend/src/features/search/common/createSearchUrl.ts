// src/main/lib/utils/createSearchUrl.ts

import { ReadonlyURLSearchParams } from "next/navigation";

export function createSearchUrl(
  searchQuery: string, 
  searchParams: ReadonlyURLSearchParams, 
  baseUrl: string = '/search/'
): string {
  const currentSort = searchParams.get('sort') || 'desc';
  const currentCategory = searchParams.get('category') || '';
  
  const urlSearchParams = new URLSearchParams({
    search: searchQuery,
    sort: currentSort,
    category: currentCategory,
    page: '1'
  });

  return `${baseUrl}?${urlSearchParams.toString()}`;
}