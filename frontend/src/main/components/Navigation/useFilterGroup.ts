// src/main/components/Navigation/useFilterGroup.ts
import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Category } from '@/main/lib/directus/directusInterfaces';
import { Lang, CategoryTranslations } from '@/main/lib/dictionaries/dictionariesTypes';
import type { DropdownItemType } from '../Interface/Dropdown/types';

interface UseFilterGroupProps {
  categories: Category[];
  categoryTranslations: CategoryTranslations;
  lang: Lang;
}

export function useFilterGroup({ 
  categories, 
  categoryTranslations,
  lang // ✅ KEPT: But will be hardcoded to 'ru' when called
}: UseFilterGroupProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Computed states
  const isArticlesPath = useMemo(() => 
    pathname.endsWith('/articles')
  , [pathname]);

  const currentCategory = useMemo(() => {
    const categorySlug = pathname.split('/').pop();
    return categories.some(cat => cat.slug === categorySlug) ? categorySlug : '';
  }, [pathname, categories]);

  const currentSort = useMemo(() => 
    searchParams.get('sort') || 'desc'
  , [searchParams]);

  // Prepare dropdown items
  const categoryItems = useMemo<DropdownItemType[]>(() => [
    { 
      id: 'all',
      label: categoryTranslations.allCategories,
      value: '',
      selected: currentCategory === ''
    },
    ...categories.map(category => ({
      id: category.slug,
      label: category.name,
      value: category.slug,
      selected: category.slug === currentCategory
    }))
  ], [categories, categoryTranslations.allCategories, currentCategory]);

  // Handlers
  const handleCategoryChange = useCallback((item: DropdownItemType) => {
    const currentSort = searchParams.get('sort') || 'desc';
    const params = new URLSearchParams();
    params.set('sort', currentSort); // Preserve current sort order

    if (item.value) {
      router.push(`/ru/category/${item.value}?${params.toString()}`); // ✅ HARDCODED: Static Russian URL
    } else {
      router.push(`/ru/articles?${params.toString()}`); // ✅ HARDCODED: Static Russian URL
    }
  }, [router, searchParams]);

  const handleReset = useCallback(() => {
    if (isArticlesPath) {
      if (currentCategory || currentSort !== 'desc') {
        router.push(`/ru/articles`); // ✅ HARDCODED: Static Russian URL
      }
    } else {
      router.push(`/ru/articles`); // ✅ HARDCODED: Static Russian URL
    }
  }, [router, isArticlesPath, currentCategory, currentSort]);

  return {
    // States
    currentCategory,
    currentSort,
    isArticlesPath,
    // Prepared data
    categoryItems,
    // Action handlers
    handleCategoryChange,
    handleReset,
  };
}