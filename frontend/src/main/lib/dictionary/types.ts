// src/main/lib/dictionary/types.ts
// ENHANCED: Added missing interfaces for metadata, errors, and content

export type Lang = 'ru';

// ===================================================================
// NAVIGATION - Complete with accessibility
// ===================================================================

export interface NavigationLabels {
  readonly home: string;
  readonly articles: string;
  readonly rubrics: string;
  readonly authors: string;
  readonly search: string;
  readonly authorArticles: string;
  readonly categoryArticles: string;
  readonly featuredArticles: string;
  readonly searchResults: string;
}

export interface NavigationTemplates {
  readonly pageTitle: string;           // "{page} — {siteName}"
  readonly sectionDescription: string; // "{action} {section} на {siteName}"
  readonly breadcrumbSeparator: string; // "→"
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
}

export interface NavigationDictionary {
  readonly labels: NavigationLabels;
  readonly templates: NavigationTemplates;
  readonly descriptions: NavigationDescriptions;
  readonly accessibility: NavigationAccessibility;
}

export interface BreadcrumbContexts {
  readonly rubric: string; // 'rubric',
  readonly author: string; // 'author', 
  readonly category: string; // 'category',
  readonly featured: string; // 'featured',
  readonly search: string; // 'search',
  readonly external: string; // 'external',
  readonly direct: string; // 'direct',
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

export interface BreadcrumbContextAria {
  readonly rubricPath: string; // 'Навигация через рубрику',
  readonly authorPath: string; // 'Навигация через автора',
  readonly categoryPath: string; // 'Навигация через категорию',
  readonly featuredPath: string; // 'Навигация через избранное',
  readonly searchPath: string; // 'Навигация через поиск',
  readonly canonicalPath: string; // 'Основная навигация',
}

export interface BreadcrumbDictionary {
  readonly contexts: BreadcrumbContexts;
  readonly contextAria: BreadcrumbContextAria;
  readonly templates: BreadcrumbTemplates;
}

// ===================================================================
// COMMON - Simple labels without pluralization
// ===================================================================

export interface CountLabels {
  readonly articles: string;
  readonly rubrics: string;
  readonly authors: string;
  readonly results: string;
  readonly items: string;
}

export interface ActionLabels {
  readonly loadMore: string;
  readonly showMore: string;
  readonly showLess: string;
  readonly readMore: string;
  readonly explore: string;
  readonly viewAll: string;
  readonly backTo: string;
}

export interface StatusLabels {
  readonly loading: string;
  readonly error: string;
  readonly notFound: string;
  readonly empty: string;
  readonly retry: string;
}

export interface CommonDictionary {
  readonly count: CountLabels;
  readonly actions: ActionLabels;
  readonly status: StatusLabels;
  readonly published: string;
  readonly updated: string;
}

// ===================================================================
// METADATA - NEW: Structured metadata fallbacks
// ===================================================================

export interface NotFoundMetadata {
  readonly title: string;
  readonly description: string;
}

export interface MetadataFallbacks {
  readonly article: NotFoundMetadata;
  readonly rubric: NotFoundMetadata;
  readonly author: NotFoundMetadata;
  readonly page: NotFoundMetadata;
  readonly content: NotFoundMetadata;
}

export interface MetadataDictionary {
  readonly notFound: MetadataFallbacks;
}

// ===================================================================
// ERRORS - NEW: Template-driven error handling
// ===================================================================

export interface ErrorTemplates {
  readonly loadingError: string;
  readonly loadingDescription: string;
  readonly retryAction: string;
  readonly backToHome: string;
  readonly criticalError: string;
  readonly criticalDescription: string;
}

export interface ErrorContentTypes {
  readonly article: string;
  readonly rubric: string;
  readonly author: string;
  readonly page: string;
  readonly content: string;
}

export interface ErrorDictionary {
  readonly templates: ErrorTemplates;
  readonly types: ErrorContentTypes;
}

// ===================================================================
// CONTENT - NEW: Content-specific labels and templates
// ===================================================================

export interface ContentLabels {
  readonly tableOfContents: string;
  readonly editorial: string;           // "Редакция {siteName}"
  readonly readingTime: string;         // "Время чтения: {minutes} мин"
  readonly wordsCount: string;          // "Слов: {count}"
}

export interface ContentTemplates {
  readonly emptyRubric: string;         // "В рубрике {name} пока нет статей"
  readonly moreAbout: string;           // "Больше о {contentType} {name}"
  readonly writtenBy: string;           // "Автор: {author}"
  readonly publishedIn: string;         // "Опубликовано в {rubric}"
}

export interface ContentDictionary {
  readonly labels: ContentLabels;
  readonly templates: ContentTemplates;
}

// ===================================================================
// SECTIONS - Template-driven content structure
// ===================================================================

export interface SectionLabels {
  readonly articles: string;
  readonly rubrics: string;
  readonly authors: string;
  readonly collection: string;
  readonly catalog: string;
}

export interface SectionTemplates {
  readonly pageTitle: string;           // "{section} — {siteName}"
  readonly collectionTitle: string;     // "Все {section}"
  readonly itemInCollection: string;    // "{item} в {collection}"
  readonly itemByAuthor: string;        // "{item} автора {author}"
  readonly collectionOf: string;     // 'Коллекция {items}'
  readonly itemsInCollectionDescription: string;     // '{items} в коллекции {collection} на {siteName}'
  readonly authorWorksDescription: string;     // 'Работы автора {author} на {siteName}'
  readonly emptyCollection: string;     // "В {collection} пока нет {items}"
  readonly totalCount: string;          // "Всего: {count} {countLabel}"
}

export interface HomeSectionLabels {
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

export interface AuthorsTranslations {
  readonly allAuthors: string;
  readonly ourAuthors: string;
  readonly noAuthorsFound: string;
  readonly moreAuthorsToLoad: string;
  readonly collectionPageDescription: string;
  readonly profileDescription: string;
  readonly articlesWrittenBy: string;
}

export interface RubricsSectionLabels {
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

export interface ArticlesLabels {
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

export interface SectionsTranslations {
  readonly labels: SectionLabels;
  readonly templates: SectionTemplates;
  readonly home: HomeSectionLabels;
  readonly authors: AuthorsTranslations;
  readonly rubrics: RubricsSectionLabels;
  readonly articles: ArticlesLabels;
}

// ===================================================================
// SEO - Comprehensive SEO optimization
// ===================================================================

export interface SEOSiteInfo {
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
  readonly pageTitle: string;           // "{title} — {siteName}"
  readonly metaDescription: string;     // "{description} на {siteName}"
  readonly collectionPage: string;      // "{collection} — {siteName}"
  readonly notFoundDescription: string; // "Запрашиваемая страница не найдена на {siteName}"
}

export interface SEOKeywords {
  readonly base: string;
  readonly articles: string;
  readonly rubrics: string;
  readonly authors: string;
}

export interface SEODictionary {
  readonly site: SEOSiteInfo;
  readonly regional: SEORegional;
  readonly templates: SEOTemplates;
  readonly keywords: SEOKeywords;
}

// ===================================================================
// SEARCH - Complete search interface
// ===================================================================

export interface SearchLabels {
  readonly title: string;
  readonly placeholder: string;
  readonly results: string;
  readonly noResults: string;
  readonly searching: string;
  readonly submit: string;
  readonly minCharacters: string;
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
  readonly templates: SearchTemplates;
  readonly accessibility: SearchAccessibility;
}

// ===================================================================
// FILTER - Filter and sorting interface
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
// ACCESSIBILITY - Universal accessibility labels
// ===================================================================

export interface Accessibility {
  readonly iconDescription: string;
  readonly decorativeIcon: string;
  readonly rubricVisualIndicator: string;
  readonly rubricDescription: string;
  readonly expandDescription: string;
}

// ===================================================================
// FOOTER - Simple footer structure
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
  readonly copyright: string;
  readonly rights: string;
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
  readonly accessibility: FooterAccessibility;
}

// ===================================================================
// MAIN DICTIONARY - Complete and enhanced
// ===================================================================

export interface Dictionary {
  readonly locale: string;
  readonly navigation: NavigationDictionary;
  readonly breadcrumb: BreadcrumbDictionary;
  readonly common: CommonDictionary;
  readonly metadata: MetadataDictionary;      // NEW
  readonly errors: ErrorDictionary;          // NEW
  readonly content: ContentDictionary;       // NEW
  readonly sections: SectionsTranslations;
  readonly seo: SEODictionary;
  readonly search: SearchDictionary;
  readonly filter: FilterDictionary;
  readonly accessibility: Accessibility;
  readonly footer: FooterDictionary;
}

// ===================================================================
// UTILITY TYPES
// ===================================================================

export type SEOPageType = 'home' | 'article' | 'rubric' | 'author' | 'search' | 'collection';

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
  readonly contentType?: string;        // NEW
  readonly minutes?: string;            // NEW
  readonly rubric?: string;             // NEW
}

export type TemplateProcessor = (template: string, variables: TemplateVariables) => string;