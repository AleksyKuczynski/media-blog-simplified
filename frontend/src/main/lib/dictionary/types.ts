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
// SEO CORE TYPES - Foundation for all SEO components
// ===================================================================

export interface SEOSiteInfo {
  readonly siteName: string;
  readonly siteDescription: string;
  readonly contactEmail: string;
  readonly socialProfiles: readonly string[];
}

export interface SEOTitleTemplates {
  readonly homePrefix: string;
  readonly homeSuffix: string;
  readonly articleTemplate: string;
  readonly rubricTemplate: string;
  readonly authorTemplate: string;
  readonly searchTemplate: string;
  readonly rubricsListTitle: string;
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

export interface SEODictionary {
  readonly site: SEOSiteInfo;
  readonly titles: SEOTitleTemplates;
  readonly descriptions: SEODescriptionTemplates;
  readonly keywords: SEOKeywordGroups;
  readonly regional: SEORegionalSettings;
}

// ===================================================================
// MAIN DICTIONARY TYPE - Modular and extensible
// ===================================================================

export interface Dictionary {
  readonly navigation: NavigationDictionary;
  readonly common: {
    // ... existing properties ...
    readonly pagination: CommonPagination; // ADD
  };
  readonly search: SearchDictionary;
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

export const isValidPageType = (pageType: string): pageType is SEOPageType => {
  return ['home', 'article', 'rubric', 'author', 'search', 'rubrics-collection'].includes(pageType);
};

// Template replacement utility type
export interface TemplateVariables {
  readonly siteName?: string;
  readonly title?: string;
  readonly rubric?: string;
  readonly author?: string;
  readonly query?: string;
}