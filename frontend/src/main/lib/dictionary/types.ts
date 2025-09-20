// src/main/lib/dictionary/types.ts
// COMPLETE: Clean TypeScript types matching the optimized dictionary structure

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
}

export interface NavigationTemplates {
  readonly pageTitle: string;           // "{page} — {siteName}"
  readonly sectionDescription: string; // "{action} {section} на {siteName}"
  readonly breadcrumbSeparator: string; // "→"
}

export interface NavigationDescriptions {
  readonly home: string;
  readonly articles: string;
  readonly rubrics: string;
  readonly authors: string;
  readonly search: string;
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
// SECTIONS - Template-driven content structure
// ===================================================================

export interface SectionLabels {
  readonly articles: string;
  readonly rubrics: string;
  readonly authors: string;
  readonly collection: string;
  readonly catalog: string;
}

export interface ContentTemplates {
  readonly pageTitle: string;           // "{section} — {siteName}"
  readonly collectionTitle: string;     // "Все {section}"
  readonly itemInCollection: string;    // "{item} в {collection}"
  readonly itemByAuthor: string;        // "{item} автора {author}"
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
  readonly templates: ContentTemplates;
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
  readonly itemPage: string;            // "{item} — {siteName}"
  readonly searchPage: string;          // "Поиск: {query} — {siteName}"
}

export interface SEOKeywords {
  readonly base: string;
  readonly rubrics: string;
  readonly articles: string;
  readonly authors: string;
  readonly music: string;
  readonly culture: string;
  readonly events: string;
  readonly mystic: string;
}

export interface SEODictionary {
  readonly site: SEOSiteInfo;
  readonly templates: SEOTemplates;
  readonly keywords: SEOKeywords;
  readonly regional: SEORegional;
}

// ===================================================================
// SEARCH - Complete search interface
// ===================================================================

export interface SearchLabels {
  readonly placeholder: string;
  readonly results: string;
  readonly noResults: string;
  readonly searching: string;
  readonly submit: string;
  readonly minCharacters: string;
  readonly queryTerm: string;        // For unified "Поисковый запрос" usage
  readonly searchAction: string;
}

export interface SearchTemplates {
  readonly resultsFor: string;          // "Результаты поиска: {query}"
  readonly pageTitle: string;           // "Поиск"
  readonly pageDescription: string;     // "Найдите интересующий вас контент"
  readonly relatedTo: string;           // "Связанные материалы"
}

export interface SearchAccessibility {
  readonly searchLabel: string;
  readonly searchButtonLabel: string;
  readonly searchInputLabel: string;
}

export interface SearchDictionary {
  readonly labels: SearchLabels;
  readonly templates: SearchTemplates;
  readonly accessibility: SearchAccessibility;
}

// ===================================================================
// FILTER - Simple filtering functionality
// ===================================================================

export interface FilterDictionary {
  readonly allCategories: string;
  readonly category: string;
  readonly sortOrder: string;
  readonly reset: string;
  readonly newest: string;
  readonly oldest: string;
  readonly categorySelector: string;
  readonly sortingControl: string;
  readonly resetButton: string;
  readonly filterGroup: string;
  readonly dropdownLabel: string;
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

export interface FooterDictionary {
  readonly about: FooterAbout;
  readonly quickLinks: FooterQuickLinks;
  readonly socialLinks: FooterSocialLinks;
  readonly legal: FooterLegal;
}

// ===================================================================
// MAIN DICTIONARY - Complete and clean
// ===================================================================

export interface Dictionary {
  readonly navigation: NavigationDictionary;
  readonly common: CommonDictionary;
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
}

export type TemplateProcessor = (template: string, variables: TemplateVariables) => string;