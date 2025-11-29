// src/main/lib/dictionary/types.ts

/**
 * Complete TypeScript type definitions for Dictionary structure
 * Mirrors the exact structure of dictionaryRU/dictionaryEN
 */

// ===================================================================
// CONSENT TYPES
// ===================================================================

export interface ConsentDictionary {
  readonly title: string;
  readonly description: string;
  readonly acceptAll: string;
  readonly rejectAll: string;
  readonly customize: string;
  readonly save: string;
  readonly back: string;
  readonly necessary: string;
  readonly analytics: string;
  readonly marketing: string;
  readonly preferences: string;
  readonly necessaryDescription: string;
  readonly analyticsDescription: string;
  readonly marketingDescription: string;
  readonly preferencesDescription: string;
  readonly privacyPolicy: string;
  readonly alwaysActive: string;
}

// ===================================================================
// NAVIGATION TYPES
// ===================================================================

export interface NavigationLabels {
  readonly home: string;
  readonly articles: string;
  readonly rubrics: string;
  readonly authors: string;
  readonly categories: string;
  readonly search: string;
  readonly authorArticles: string;
  readonly categoryArticles: string;
  readonly featuredArticles: string;
  readonly searchResults: string;
}

export interface NavigationTemplates {
  readonly pageTitle: string;
  readonly sectionDescription: string;
  readonly breadcrumbSeparator: string;
  readonly contextualPath: string;
  readonly authorContext: string;
  readonly categoryContext: string;
  readonly searchContext: string;
}

export interface NavigationDescriptions {
  readonly home: string;
  readonly articles: string;
  readonly rubrics: string;
  readonly authors: string;
  readonly search: string;
  readonly fromAuthor: string;
  readonly fromCategory: string;
  readonly fromFeatured: string;
  readonly fromSearch: string;
}

export interface NavigationAccessibility {
  readonly mainNavigation: string;
  readonly menuTitle: string;
  readonly menuDescription: string;
  readonly openMenu: string;
  readonly closeMenu: string;
  readonly logoAlt: string;
  readonly logoMainPageLabel: string;
  readonly primarySectionsLabel: string;
  readonly mainMenuLabel: string;
  readonly searchAndSettingsLabel: string;
  readonly siteSearchLabel: string;
  readonly skipToContent: string;
  readonly skipToNavigation: string;
  readonly breadcrumbNavigation: string;
  readonly paginationNavigation: string;
  readonly pageNavigation: string;
}

export interface NavigationDictionary {
  readonly labels: NavigationLabels;
  readonly templates: NavigationTemplates;
  readonly descriptions: NavigationDescriptions;
  readonly accessibility: NavigationAccessibility;
}

// ===================================================================
// BREADCRUMB TYPES
// ===================================================================

export interface BreadcrumbContexts {
  readonly rubric: string;
  readonly author: string;
  readonly category: string;
  readonly featured: string;
  readonly search: string;
  readonly external: string;
  readonly direct: string;
}

export interface BreadcrumbContextAria {
  readonly rubricPath: string;
  readonly authorPath: string;
  readonly categoryPath: string;
  readonly featuredPath: string;
  readonly searchPath: string;
  readonly canonicalPath: string;
}

export interface BreadcrumbTemplates {
  readonly rubricLabel: string;
  readonly articleLabel: string;
  readonly authorProfile: string;
  readonly categoryLabel: string;
  readonly fromRubric: string;
  readonly fromArticles: string;
  readonly fromSearch: string;
  readonly searchWithQuery: string;
}

export interface BreadcrumbDictionary {
  readonly contexts: BreadcrumbContexts;
  readonly contextAria: BreadcrumbContextAria;
  readonly templates: BreadcrumbTemplates;
}

// ===================================================================
// COMMON TYPES
// ===================================================================

export interface CommonCount {
  readonly articles: string;
  readonly rubrics: string;
  readonly authors: string;
  readonly results: string;
  readonly items: string;
}

export interface CommonPagination {
    readonly previous: string;
    readonly next: string;
    readonly page: string;
    readonly of: string;
    readonly goToPage: string;
    readonly currentPage: string;
    readonly firstPage: string;
    readonly lastPage: string;
}

export interface CommonActions {
  readonly loadMore: string;
  readonly showMore: string;
  readonly showLess: string;
  readonly readMore: string;
  readonly explore: string;
  readonly viewAll: string;
  readonly backTo: string;
}

export interface CommonStatus {
  readonly loading: string;
  readonly error: string;
  readonly notFound: string;
  readonly empty: string;
  readonly retry: string;
}

export interface CommonDictionary {
  readonly count: CommonCount;
  readonly pagination: CommonPagination;
  readonly actions: CommonActions;
  readonly status: CommonStatus;
  readonly published: string;
  readonly updated: string;
}

// ===================================================================
// METADATA TYPES
// ===================================================================

export interface NotFoundItem {
  readonly title: string;
  readonly description: string;
}

export interface MetadataNotFound {
  readonly article: NotFoundItem;
  readonly rubric: NotFoundItem;
  readonly author: NotFoundItem;
  readonly page: NotFoundItem;
  readonly content: NotFoundItem;
}

export interface MetadataDictionary {
  readonly notFound: MetadataNotFound;
}

// ===================================================================
// ERROR TYPES
// ===================================================================

export interface ErrorEngagement {
  readonly updateFailed: string;
}

export interface ErrorTemplates {
  readonly loadingError: string;
  readonly loadingDescription: string;
  readonly retryAction: string;
  readonly backToHome: string;
  readonly criticalError: string;
  readonly criticalDescription: string;
}

export interface ErrorTypes {
  readonly article: string;
  readonly rubric: string;
  readonly author: string;
  readonly page: string;
  readonly content: string;
}

export interface ErrorsDictionary {
  readonly engagement: ErrorEngagement;
  readonly templates: ErrorTemplates;
  readonly types: ErrorTypes;
}

// ===================================================================
// CONTENT TYPES
// ===================================================================

export interface ContentLabels {
  readonly tableOfContents: string;
  readonly editorial: string;
  readonly readingTime: string;
  readonly wordsCount: string;
}

export interface ContentTemplates {
  readonly emptyRubric: string;
  readonly moreAbout: string;
  readonly writtenBy: string;
  readonly publishedIn: string;
}

export interface ContentDictionary {
  readonly labels: ContentLabels;
  readonly templates: ContentTemplates;
}

// ===================================================================
// SHARE TYPES
// ===================================================================

export interface SharePlatforms {
  readonly telegram: string;
  readonly whatsapp: string;
  readonly vk: string;
  readonly twitter: string;
  readonly facebook: string;
  readonly instagram: string;
  readonly copy: string;
}

export interface ShareMessages {
  readonly linkCopied: string;
  readonly instagramCopied: string;
}

export interface ShareAccessibility {
  readonly shareOn: string;
  readonly closeDialog: string;
}

export interface ShareDictionary {
  readonly title: string;
  readonly platforms: SharePlatforms;
  readonly messages: ShareMessages;
  readonly accessibility: ShareAccessibility;
}

// ===================================================================
// SECTIONS TYPES
// ===================================================================

export interface SectionLabels {
  readonly articles: string;
  readonly rubrics: string;
  readonly author: string;
  readonly authors: string;
  readonly categories: string;
  readonly collection: string;
}

export interface SectionTemplates {
  readonly pageTitle: string;
  readonly collectionTitle: string;
  readonly itemInCollection: string;
  readonly itemByAuthor: string;
  readonly collectionOf: string;
  readonly itemsInCollectionDescription: string;
  readonly authorWorksDescription: string;
  readonly emptyCollection: string;
  readonly totalCount: string;
  readonly itemDescription: string;
  readonly categoryDescription: string;
  readonly noCategoryArticles: string;
}

export interface SectionHome {
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

export interface SectionAuthors {
  readonly allAuthors: string;
  readonly ourAuthors: string;
  readonly noAuthorsFound: string;
  readonly moreAuthorsToLoad: string;
  readonly collectionPageDescription: string;
  readonly profileDescription: string;
  readonly articlesWrittenBy: string;
  readonly authorPhoto: string;
}

export interface SectionRubrics {
  readonly allRubrics: string;
  readonly featuredRubric: string;
  readonly articlesInRubric: string;
  readonly rubricList: string;
  readonly rubricsCatalog: string;
  readonly browseAllRubrics: string;
  readonly categoriesDescription: string;
  readonly collectionPageDescription: string;
  readonly noRubricsAvailable: string;
  readonly checkBackLater: string;
  readonly readMoreAbout: string;
  readonly exploreRubric: string;
  readonly iconAltText: string;
  readonly noIcon: string;
  readonly rubricIcon: string;
}

export interface SectionArticles {
  readonly allArticles: string;
  readonly featuredArticles: string;
  readonly latestArticles: string;
  readonly noArticlesFound: string;
  readonly noFeaturedArticles: string;
  readonly moreArticlesToLoad: string;
  readonly loadMore: string;
  readonly collectionPageDescription: string;
  readonly byAuthor: string;
  readonly inRubric: string;
}

export interface SectionsDictionary {
  readonly labels: SectionLabels;
  readonly templates: SectionTemplates;
  readonly home: SectionHome;
  readonly authors: SectionAuthors;
  readonly rubrics: SectionRubrics;
  readonly articles: SectionArticles;
}

// ===================================================================
// SEO TYPES
// ===================================================================

export interface SEOSite {
  readonly name: string;
  readonly fullName: string;
  readonly description: string;
  readonly organizationDescription: string;
  readonly url: string;
  readonly contactEmail: string;
  readonly socialProfiles: readonly string[];
  readonly geographicAreas: readonly string[];
}

export interface SEORegional {
  readonly language: string;
  readonly region: string;
  readonly targetMarkets: readonly string[];
}

export interface SEOTemplates {
  readonly pageTitle: string;
  readonly metaDescription: string;
  readonly collectionPage: string;
  readonly notFoundDescription: string;
}

export interface SEOKeywords {
  readonly base: string;
  readonly articles: string;
  readonly rubrics: string;
  readonly authors: string;
}

export interface SEODictionary {
  readonly site: SEOSite;
  readonly regional: SEORegional;
  readonly templates: SEOTemplates;
  readonly keywords: SEOKeywords;
}

// ===================================================================
// SEARCH TYPES
// ===================================================================

export interface SearchLabels {
  readonly title: string;
  readonly placeholder: string;
  readonly results: string;
  readonly noResults: string;
  readonly searching: string;
  readonly submit: string;
  readonly minCharacters: string;
  readonly searchButton: string;
}

export interface SearchHub {
  readonly tipsTitle: string;
  readonly tips: readonly string[];
  readonly exploreHeading: string;
  readonly exploreDescription: string;
  readonly browseCategories: string;
  readonly browseCategoriesDescription: string;
  readonly noResultsSuggestion: string;
  readonly emptyStateMessage: string;
}

export interface SearchTemplates {
  readonly resultsFor: string;
  readonly pageTitle: string;
  readonly pageDescription: string;
  readonly relatedTo: string;
}

export interface SearchAccessibility {
  readonly searchLabel: string;
  readonly searchButtonLabel: string;
  readonly searchInputLabel: string;
  readonly searchDescription: string;
  readonly searchResultsLabel: string;
  readonly clearSearchLabel: string;
  readonly openSearch: string;
  readonly closeSearch: string;
}

export interface SearchDictionary {
  readonly labels: SearchLabels;
  readonly hub: SearchHub;
  readonly templates: SearchTemplates;
  readonly accessibility: SearchAccessibility;
}

// ===================================================================
// FILTER TYPES
// ===================================================================

export interface FilterLabels {
  readonly sortBy: string;
  readonly category: string;
  readonly allCategories: string;
  readonly newest: string;
  readonly oldest: string;
  readonly reset: string;
  readonly apply: string;
}

export interface FilterAccessibility {
  readonly categorySelector: string;
  readonly sortingControl: string;
  readonly resetButton: string;
  readonly filterGroup: string;
  readonly dropdownLabel: string;
}

export interface FilterDictionary {
  readonly labels: FilterLabels;
  readonly accessibility: FilterAccessibility;
}

// ===================================================================
// ACCESSIBILITY TYPES
// ===================================================================

export interface AccessibilityDictionary {
  readonly iconDescription: string;
  readonly decorativeIcon: string;
  readonly rubricVisualIndicator: string;
  readonly rubricDescription: string;
  readonly expandDescription: string;
}

// ===================================================================
// FOOTER TYPES
// ===================================================================

export interface FooterAbout {
  readonly title: string;
  readonly description: string;
}

export interface FooterQuickLinks {
  readonly title: string;
  readonly ariaLabel: string;
}

export interface FooterSocialLinks {
  readonly title: string;
}

export interface FooterLegal {
  readonly title: string;
  readonly copyright: string;
  readonly rights: string;
  readonly privacyPolicy: string;
  readonly terms: string;
  readonly sitemap: string;
}

export interface FooterContactModal {
  readonly title: string;
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly subjectLabel: string;
  readonly subjectPlaceholder: string;
  readonly messageLabel: string;
  readonly messagePlaceholder: string;
  readonly submitButton: string;
  readonly cancelButton: string;
  readonly submitting: string;
  readonly requiredField: string;
  readonly successMessage: string;
  readonly errorMessage: string;
  readonly emailRequired: string;
  readonly emailInvalid: string;
  readonly subjectRequired: string;
  readonly messageRequired: string;
}

export interface FooterContact {
  readonly title: string;
  readonly buttonLabel: string;
  readonly emailSubject: string;
  readonly modal: FooterContactModal;
}

export interface FooterAccessibility {
  readonly skipToFooter: string;
  readonly footerNavigation: string;
}

export interface FooterDictionary {
  readonly about: FooterAbout;
  readonly quickLinks: FooterQuickLinks;
  readonly socialLinks: FooterSocialLinks;
  readonly legal: FooterLegal;
  readonly contact: FooterContact;
  readonly accessibility: FooterAccessibility;
}

// ===================================================================
// MAIN DICTIONARY TYPE
// ===================================================================

/**
 * Complete Dictionary type that mirrors dictionaryRU/dictionaryEN structure
 * Use this type for all dictionary-related type checking
 */
export interface Dictionary {
  readonly locale: string;
  readonly consent: ConsentDictionary;
  readonly navigation: NavigationDictionary;
  readonly breadcrumb: BreadcrumbDictionary;
  readonly common: CommonDictionary;
  readonly metadata: MetadataDictionary;
  readonly errors: ErrorsDictionary;
  readonly content: ContentDictionary;
  readonly share: ShareDictionary;
  readonly sections: SectionsDictionary;
  readonly seo: SEODictionary;
  readonly search: SearchDictionary;
  readonly filter: FilterDictionary;
  readonly accessibility: AccessibilityDictionary;
  readonly footer: FooterDictionary;
}

// ===================================================================
// TEMPLATE VARIABLE TYPES
// ===================================================================

/**
 * All possible template variables used in dictionary strings
 * Use for type-safe template processing
 */
export interface TemplateVariables {
  readonly siteName?: string;
  readonly title?: string;
  readonly page?: string;
  readonly section?: string;
  readonly collection?: string;
  readonly item?: string;
  readonly items?: string;
  readonly author?: string;
  readonly query?: string;
  readonly count?: string;
  readonly countLabel?: string;
  readonly action?: string;
  readonly description?: string;
  readonly year?: string;
  readonly name?: string;
  readonly contentType?: string;
  readonly minutes?: string;
  readonly rubric?: string;
  readonly platform?: string;
  readonly authorName?: string;
  readonly categoryName?: string;
  readonly context?: string;
  readonly search?: string;
  readonly current?: string;
  readonly total?: string;
  readonly target?: string;
}

/**
 * Template processor function type
 */
export type TemplateProcessor = (
  template: string,
  variables: TemplateVariables
) => string;

// ===================================================================
// UTILITY TYPES
// ===================================================================

/**
 * Supported language codes
 */
export type SupportedLanguage = 'ru' | 'en';

/**
 * Language code type alias
 */
export type Lang = SupportedLanguage;

/**
 * SEO page types for metadata generation
 */
export type SEOPageType = 
  | 'home' 
  | 'article' 
  | 'rubric' 
  | 'author' 
  | 'search' 
  | 'collection'
  | 'category'
  | 'page';

/**
 * Collection types for SEO
 */
export type CollectionType = 'rubrics' | 'authors' | 'articles';

/**
 * Content types for error handling
 */
export type ContentType = 'article' | 'rubric' | 'author' | 'page' | 'content';

/**
 * Sort directions
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Breadcrumb context types
 */
export type BreadcrumbContext = 
  | 'rubric' 
  | 'author' 
  | 'category' 
  | 'featured' 
  | 'search' 
  | 'external' 
  | 'direct';

// ===================================================================
// TYPE GUARDS
// ===================================================================

/**
 * Type guard to check if a string is a supported language
 */
export function isSupportedLanguage(lang: string): lang is SupportedLanguage {
  return lang === 'ru' || lang === 'en';
}

/**
 * Type guard to check if a string is a valid collection type
 */
export function isCollectionType(type: string): type is CollectionType {
  return type === 'rubrics' || type === 'authors' || type === 'articles';
}

/**
 * Type guard to check if a string is a valid content type
 */
export function isContentType(type: string): type is ContentType {
  return ['article', 'rubric', 'author', 'page', 'content'].includes(type);
}

// ===================================================================
// HELPER TYPES FOR COMPONENTS
// ===================================================================

/**
 * Props interface for components that need dictionary and language
 */
export interface DictionaryComponentProps {
  readonly dictionary: Dictionary;
  readonly lang: Lang;
}

/**
 * Props interface for components that only need dictionary
 */
export interface DictionaryOnlyProps {
  readonly dictionary: Dictionary;
}

/**
 * Optional dictionary props for components where it might not be available
 */
export interface OptionalDictionaryProps {
  readonly dictionary?: Dictionary;
}

// ===================================================================
// EXPORT ALL TYPES
// ===================================================================

export type {
  Dictionary as default,
};