// src/main/lib/dictionary/types.ts

export type Lang = 'ru';

// ===================================================================
// NAVIGATION TYPES
// ===================================================================

export interface NavigationLabels {
  readonly home: string;
  readonly articles: string;
  readonly rubrics: string;
  readonly authors: string;
  readonly search: string;
}

export interface NavigationDescriptions {
  readonly home: string;
  readonly articles: string;
  readonly rubrics: string;
  readonly authors: string;
  readonly search: string;
}

export interface NavigationAccessibility {
  readonly logoAlt: string;
  readonly logoMainPageLabel: string;
  readonly mainNavigation: string;
  readonly primarySectionsLabel: string;
  readonly mainMenuLabel: string;
  readonly searchAndSettingsLabel: string;
  readonly siteSearchLabel: string;
  readonly skipToContent: string;
  readonly skipToNavigation: string;
  readonly skipToSearch: string;
  readonly skipToFooter: string;
  readonly openMenu: string;
  readonly closeMenu: string;
  readonly menuTitle: string;
  readonly menuDescription: string;
  readonly keyboardNavigationLabel: string;
  readonly currentPage: string;
  readonly clearSearch: string;
  readonly focusSearch: string;
}

export interface NavigationSEO {
  readonly navigationTitle: string;
  readonly navigationDescription: string;
  readonly websiteSearchTitle: string;
  readonly websiteSearchDescription: string;
  readonly geographicAreas: readonly string[];
  readonly audience: string;
}

export interface NavigationDictionary {
  readonly labels: NavigationLabels;
  readonly descriptions: NavigationDescriptions;
  readonly accessibility: NavigationAccessibility;
  readonly seo: NavigationSEO;
}

// ===================================================================
// COMMON INTERFACES
// ===================================================================

export interface CommonDictionary {
  readonly loading: string;
  readonly readMore: string;
  readonly showMore: string;
  readonly showLess: string;
  readonly published: string;
  readonly by: string;
  readonly in: string;
  readonly minutes: string;
  readonly readingTime: string;
  readonly loadMore: string;
  readonly editorial: string;
  readonly tableOfContents: string;
  readonly noResults: string;
  readonly noContent: string;
  readonly backToTop: string;
  readonly pagination: CommonPagination;
  readonly articles: {
    readonly one: string;
    readonly few: string;
    readonly many: string;
  };
}

export interface CommonPagination {
  readonly page: string;
  readonly of: string;
  readonly next: string;
  readonly previous: string;
}

// ===================================================================
// SEARCH TYPES
// ===================================================================

export interface SearchLabels {
  readonly placeholder: string;
  readonly submit: string;
  readonly results: string;
  readonly noResults: string;
  readonly searching: string;
  readonly minCharacters: string;
}

export interface SearchTemplates {
  readonly resultsFor: string;
  readonly pageTitle: string;
  readonly pageDescription: string;
  readonly relatedTo: string;
  readonly noResultsDescription: string;
  readonly resultsSummary: string;
}

export interface SearchAccessibility {
  readonly searchLabel: string;
  readonly searchDescription: string;
  readonly searchInputLabel: string;
  readonly searchButtonLabel: string;
  readonly searchResultsLabel: string;
  readonly noResultsAnnouncement: string;
  readonly searchingAnnouncement: string;
  readonly clearSearchLabel: string;
}

export interface SearchMessages {
  readonly searchQuery: string;
  readonly foundResults: string;
  readonly tryFollowing: string;
  readonly checkSpelling: string;
  readonly useGeneralTerms: string;
  readonly trySynonyms: string;
}

export interface SearchInterface {
  readonly title: string;
  readonly description: string;
  readonly alternativeNavigation: string;
}

export interface SearchNavigation {
  readonly popularRubrics: string;
  readonly latestArticles: string;
  readonly ourAuthors: string;
  readonly viewAllArticles: string;
  readonly meetAuthors: string;
}

export interface SearchPluralization {
  readonly result: {
    readonly one: string;
    readonly few: string;
    readonly many: string;
  };
}

export interface SearchSchema {
  readonly searchActionDescription: string;
  readonly searchInterfaceDescription: string;
  readonly breadcrumbNavigation: string;
  readonly searchResultsDescription: string;
  readonly searchResultsList: string;
  readonly searchResultsFound: string;
  readonly mentionedInSearch: string;
}

export interface SearchDictionary {
  readonly labels: SearchLabels;
  readonly templates: SearchTemplates;
  readonly accessibility: SearchAccessibility;
  readonly messages: SearchMessages;
  readonly interface: SearchInterface;
  readonly navigation: SearchNavigation;
  readonly pluralization: SearchPluralization;
  readonly schema: SearchSchema;
}

// ===================================================================
// SECTIONS - Page-specific content
// ===================================================================

export interface HomeTranslations {
  readonly welcomeTitle: string;
  readonly welcomeDescription: string;
  readonly featuredContent: string;
  readonly latestUpdates: string;
  readonly exploreRubrics: string;
  readonly viewAllRubrics: string;
  readonly featuredRubrics: string;
  readonly featuredDescription: string;
  readonly rubricsDescription: string;
  readonly rubricsSectionDescription: string;
  readonly viewAllRubricsDescription: string;
  readonly quickNavigation: string;
}

export interface ArticlesTranslations {
  readonly allArticles: string;
  readonly featuredArticles: string;
  readonly latestArticles: string;
  readonly noArticlesFound: string;
  readonly noFeaturedArticles: string;
  readonly moreArticlesToLoad: string;
  readonly loadMore: string;
}

export interface AuthorsTranslations {
  readonly allAuthors: string;
  readonly ourAuthors: string;
  readonly noAuthorsFound: string;
  readonly moreAuthorsToLoad: string;
}

export interface AuthorTranslations {
  readonly noArticlesFound: string;
  readonly articlesByAuthor: string;
  readonly authorProfile: string;
  readonly articlesWrittenBy: string;
}

export interface CategoriesTranslations {
  readonly allCategories: string;
  readonly noArticlesFound: string;
}

export interface RubricsTranslations {
  readonly allRubrics: string;
  readonly featuredRubric: string;
  readonly articlesInRubric: string;
  readonly rubricList: string;
  readonly noRubricsAvailable: string;
  readonly iconAltText: string;
  readonly noIcon: string;
  readonly rubricIcon: string;
  readonly checkBackLater: string;
  readonly readMoreAbout: string;
  readonly exploreRubric: string;
  readonly rubricsCatalog: string;
  readonly browseAllRubrics: string;
  readonly categoriesDescription: string;
  readonly totalRubrics: string;
  readonly rubricCard: string;
  readonly viewRubricDetails: string;
}

export interface SectionsTranslations {
  readonly home: HomeTranslations;
  readonly articles: ArticlesTranslations;
  readonly authors: AuthorsTranslations;
  readonly author: AuthorTranslations;
  readonly categories: CategoriesTranslations;
  readonly rubrics: RubricsTranslations;
}

// ===================================================================
// INTERFACE CONTROLS - Sorting, filtering, categories
// ===================================================================

export interface SortingTranslations {
  readonly sortOrder: string;
  readonly newest: string;
  readonly oldest: string;
}

export interface FilterTranslations {
  readonly all: string;
  readonly category: string;
  readonly author: string;
  readonly date: string;
  readonly reset: string;
}

export interface CategoryTranslations {
  readonly all: string;
  readonly music: string;
  readonly events: string;
  readonly culture: string;
  readonly ideas: string;
  readonly mystic: string;
  readonly allCategories: string;
}

// ===================================================================
// ACCESSIBILITY - Screen reader and navigation aids
// ===================================================================

export interface Accessibility {
  readonly iconDescription: string;
  readonly decorativeIcon: string;
  readonly rubricVisualIndicator: string;
  readonly rubricDescription: string;
  readonly expandDescription: string;
}

// ===================================================================
// FOOTER - Site footer content
// ===================================================================

export interface FooterAbout {
  readonly title: string;
  readonly description: string;
}

export interface FooterQuickLinks {
  readonly title: string;
}

export interface FooterSocialLinks {
  readonly title: string;
}

export interface FooterContact {
  readonly faq: string;
  readonly helpCenter: string;
}

export interface FooterTranslations {
  readonly about: FooterAbout;
  readonly quickLinks: FooterQuickLinks;
  readonly socialLinks: FooterSocialLinks;
  readonly contact: FooterContact;
}

// ===================================================================
// SEO TYPES - Complete Russian market optimization
// ===================================================================

export interface SEOSiteInfo {
  readonly name: string;
  readonly fullName: string;
  readonly description: string;
  readonly url: string;
  readonly contactEmail: string;
  readonly socialProfiles: readonly string[];
  readonly organizationDescription: string;
  readonly geographicAreas: readonly string[];
}

export interface SEOTitleTemplates {
  readonly homePrefix: string;
  readonly homeSuffix: string;
  readonly articleTemplate: string;
  readonly rubricTemplate: string;
  readonly authorTemplate: string;
  readonly searchTemplate: string;
  readonly rubricsListTitle: string;
  readonly rubricsList: string;
}

export interface SEODescriptionTemplates {
  readonly home: string;
  readonly articleTemplate: string;
  readonly rubricTemplate: string;
  readonly authorTemplate: string;
  readonly searchTemplate: string;
  readonly rubricsList: string;
}

export interface SEOKeywordGroups {
  readonly general: string;
  readonly articles: string;
  readonly rubrics: string;
  readonly authors: string;
  readonly rubricsList: string;
  readonly music: string;
  readonly culture: string;
  readonly events: string;
  readonly mystic: string;
}

export interface SEORegionalSettings {
  readonly language: string;
  readonly region: string;
  readonly geographicCoverage: string;
  readonly targetMarkets: readonly string[];
}

export interface SEOStructuredData {
  readonly organizationName: string;
  readonly organizationDescription: string;
  readonly contactEmail: string;
  readonly socialProfiles: readonly string[];
  readonly geographicAreas: readonly string[];
  readonly rubricsCollection: {
    readonly name: string;
    readonly description: string;
    readonly numberOfItems: string;
    readonly itemListElement: string;
  };
}

export interface SEODictionary {
  readonly site: SEOSiteInfo;
  readonly titles: SEOTitleTemplates;
  readonly descriptions: SEODescriptionTemplates;
  readonly keywords: SEOKeywordGroups;
  readonly regional: SEORegionalSettings;
  readonly structuredData: SEOStructuredData;
}

// ===================================================================
// MAIN DICTIONARY TYPE - Complete and modular
// ===================================================================

export interface Dictionary {
  readonly navigation: NavigationDictionary;
  readonly common: CommonDictionary;
  readonly search: SearchDictionary;
  readonly sections: SectionsTranslations;
  readonly sorting: SortingTranslations;
  readonly filter: FilterTranslations;
  readonly categories: CategoryTranslations;
  readonly accessibility: Accessibility;
  readonly footer: FooterTranslations;
  readonly seo: SEODictionary;
}


// ===================================================================
// UTILITY TYPES - For type safety and validation
// ===================================================================

export type NavigationRoute = keyof NavigationLabels;
export type SEOPageType = 'home' | 'article' | 'rubric' | 'author' | 'search' | 'rubrics-collection';

// Type guards for runtime validation
export const isValidRoute = (route: string): route is NavigationRoute => {
  return ['home', 'articles', 'rubrics', 'authors', 'search'].includes(route);
};

// Template replacement utility type
export interface TemplateVariables {
  readonly siteName?: string;
  readonly title?: string;
  readonly rubric?: string;
  readonly author?: string;
  readonly query?: string;
}

// Template processing function type
export type TemplateProcessor = (template: string, variables: TemplateVariables) => string;

// Type guards for runtime validation
export const isValidPageType = (pageType: string): pageType is SEOPageType => {
  return ['home', 'article', 'rubric', 'author', 'search', 'rubrics-collection'].includes(pageType);
};

// SEO metadata validation type
export interface SEOValidationResult {
  readonly isValid: boolean;
  readonly warnings: readonly string[];
  readonly errors: readonly string[];
}