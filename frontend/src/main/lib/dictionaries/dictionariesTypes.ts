// src/main/lib/dictionaries/dictionariesTypes.ts - FIXED
export type Lang = 'ru'; // Simplified to Russian only

// Basic structure interfaces that components still expect
export interface NavigationTranslations {
  home: string;
  rubrics: string;
  authors: string;
  search: string;
  articles: string;
}

export interface SearchTranslations {
  placeholder: string;
  searching: string;
  noResults: string;
  results: string;
  resultsFor: string;
  pageTitle: string;
  pageDescription: string;
  relatedTo: string;
  submit: string;
  minCharacters: string;
}

export interface FooterTranslations {
  about: {
    title: string;
    description: string;
  };
  quickLinks: {
    title: string;
  };
  socialLinks: {
    title: string;
  };
  contact: {
    faq: string;
    helpCenter: string;
  };
  credentials: {
    copyright: string;
    privacyPolicy: string;
    termsOfService: string;
  };
  kuKraft: {
    designedWithLove: string;
  };
}

export interface CommonTranslations {
  loading: string;
  readMore: string;
  showMore: string;
  showLess: string;
  published: string;
  by: string;
  in: string;
  minutes: string;
  readingTime: string;
  loadMore: string;
  editorial: string;
  tableOfContents: string;
}

export interface SortingTranslations {
  sortOrder: string;
  newest: string;
  oldest: string;
}

export interface FilterTranslations {
  reset: string;
}

export interface CategoryTranslations {
  categories: string;
  allCategories: string;
  selectCategory: string;
}

// ✅ KEEP: Still used for color scheme switching (light/dark mode + color schemes)
export interface ColorsTranslations {
  name: string;
  default: string;
  scheme1: string;
  scheme2: string;
}

// ❌ REMOVED: No longer needed - we only have rounded theme now
// export interface ThemesTranslations {
//   name: string;
//   default: string;
//   rounded: string;
//   sharp: string;
// }

// Section-specific interfaces
export interface HomeTranslations {
  welcomeTitle: string;
  welcomeDescription: string;
  featuredContent: string;
  latestUpdates: string;
  exploreRubrics: string;
  viewAllRubrics: string;
}

export interface ArticlesTranslations {
  allArticles: string;
  featuredArticles: string;
  latestArticles: string;
  noArticlesFound: string;
  noFeaturedArticles: string;
  moreArticlesToLoad: string;
  loadMore: string;
}

export interface AuthorsTranslations {
  allAuthors: string;
  ourAuthors: string;
  noAuthorsFound: string;
  moreAuthorsToLoad: string;
}

export interface AuthorTranslations {
  noArticlesFound: string;
  articlesByAuthor: string;
  authorProfile: string;
  articlesWrittenBy: string;
}

export interface CategoriesTranslations {
  allCategories: string;
  noArticlesFound: string;
}

export interface RubricsTranslations {
  allRubrics: string;
  featuredRubric: string;
  rubricList: string;
}

export interface SectionsTranslations {
  home: HomeTranslations;
  articles: ArticlesTranslations;
  authors: AuthorsTranslations;
  author: AuthorTranslations;
  categories: CategoriesTranslations;
  rubrics: RubricsTranslations;
}

// ✅ FIXED: Main dictionary interface - REMOVED themes requirement
export interface Dictionary {
  navigation: NavigationTranslations;
  footer: FooterTranslations;
  common: CommonTranslations;
  search: SearchTranslations;
  sections: SectionsTranslations;
  sorting: SortingTranslations;
  filter: FilterTranslations;
  categories: CategoryTranslations;
  // ❌ REMOVED: themes: ThemesTranslations; - no longer needed
  colors: ColorsTranslations; // ✅ KEEP: for color scheme switching
}

// Default search translations (used by some components)
export const DEFAULT_SEARCH_TRANSLATIONS: SearchTranslations = {
  placeholder: "Поиск статей...",
  searching: "Поиск...",
  noResults: "Результатов не найдено",
  results: "Результаты поиска",
  resultsFor: 'Результаты для "{query}"',
  pageTitle: "Поиск",
  pageDescription: "Поиск статей",
  relatedTo: "связанные с",
  submit: "Поиск",
  minCharacters: "Введите минимум 3 символа"
};