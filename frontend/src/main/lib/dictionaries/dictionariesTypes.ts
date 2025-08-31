// src/main/lib/dictionaries/dictionariesTypes.ts - Fixed to match enhanced dictionary
export type Lang = 'ru'; // Simplified to Russian only

// Basic structure interfaces
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

// Enhanced common translations with Russian pluralization
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
  // Added: Russian pluralization support
  articles: {
    one: string;   // 1 статья
    few: string;   // 2-4 статьи  
    many: string;  // 5+ статей
  };
}

export interface SortingTranslations {
  sortOrder: string;
  newest: string;
  oldest: string;
}

export interface FilterTranslations {
  all: string;
  category: string;
  author: string;
  date: string;
}

export interface CategoryTranslations {
  all: string;
  music: string;
  events: string;
  culture: string;
  ideas: string;
  mystic: string;
}

// Enhanced section-specific interfaces
export interface HomeTranslations {
  welcomeTitle: string;
  welcomeDescription: string;
  featuredContent: string;
  latestUpdates: string;
  exploreRubrics: string;
  viewAllRubrics: string;
  // Enhanced: SEO-optimized descriptions
  featuredDescription: string;
  rubricsDescription: string;
  viewAllRubricsDescription: string;
  quickNavigation: string;
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
  articlesInRubric: string;
  rubricList: string;
  // Enhanced: Missing translations
  noRubricsAvailable: string;
}

export interface SectionsTranslations {
  home: HomeTranslations;
  articles: ArticlesTranslations;
  authors: AuthorsTranslations;
  author: AuthorTranslations;
  categories: CategoriesTranslations;
  rubrics: RubricsTranslations;
}

// Enhanced SEO translations interface
export interface SEOTranslations {
  siteName: string;
  titles: {
    homePrefix: string;
    homeSuffix: string;
  };
  descriptions: {
    home: string;
  };
  keywords: {
    general: string;
  };
}

// Main dictionary interface - now matches enhanced dictionary
export interface Dictionary {
  navigation: NavigationTranslations;
  footer: FooterTranslations;
  common: CommonTranslations;
  search: SearchTranslations;
  sections: SectionsTranslations;
  sorting: SortingTranslations;
  filter: FilterTranslations;
  categories: CategoryTranslations;
  seo: SEOTranslations;
}