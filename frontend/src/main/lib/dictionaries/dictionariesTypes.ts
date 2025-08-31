// src/main/lib/dictionaries/dictionariesTypes.ts - Updated with Missing Navigation Keys
export type Lang = 'ru'; // Simplified to Russian only

// Enhanced navigation interface with missing keys and SEO descriptions
export interface NavigationTranslations {
  home: string;
  rubrics: string;
  authors: string;
  search: string;
  articles: string;
  logoAlt: string;
  primarySections: string;
  currentPage: string;
  mainNavigation: string;
  menuTitle: string;
  menuDescription: string;
  openMenu: string;
  closeMenu: string;
  skipToContent: string;
  skipToNavigation: string;
  skipToSearch: string;
  skipToFooter: string;
  keyboardNavigationLabel: string;
  clearSearch: string;
  focusSearch: string;
  articlesDescription: string;
  rubricsDescription: string;
  authorsDescription: string;
  primarySectionsLabel: string;
  mainMenuLabel: string;
  searchAndSettingsLabel: string;
  siteSearchLabel: string;
  logoMainPageLabel: string;
  homepageDescription: string;
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
  // Russian pluralization support
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
  reset: string;
}

export interface CategoryTranslations {
  all: string;
  music: string;
  events: string;
  culture: string;
  ideas: string;
  mystic: string;
  allCategories: string;
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
    // New template-based titles
    articleTemplate: string;
    rubricTemplate: string;
    authorTemplate: string;
    searchTemplate: string;
  };
  descriptions: {
    home: string;
    // New template-based descriptions
    articleTemplate: string;
    rubricTemplate: string;
    authorTemplate: string;
    searchTemplate: string;
  };
  keywords: {
    general: string;
    // New specialized keywords
    articles: string;
    rubrics: string;
    authors: string;
    music: string;
    culture: string;
    events: string;
    mystic: string;
  };
  // New structured data templates
  structuredData: {
    organizationName: string;
    organizationDescription: string;
    contactEmail: string;
    socialProfiles: string[];
    geographicAreas: string[];
  };
}

// Main dictionary interface - matches enhanced dictionary
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