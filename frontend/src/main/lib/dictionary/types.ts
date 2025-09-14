// src/main/lib/dictionary/types.ts
// UPDATED: Added navigation accessibility interface

export type Lang = 'ru';

// ===================================================================
// COMMON LABELS - Simple count labels, no pluralization
// ===================================================================

export interface CountLabels {
  readonly articles: string;  // "Статей:"
  readonly rubrics: string;   // "Рубрик:"
  readonly authors: string;   // "Авторов:"
  readonly results: string;   // "Результатов:"
  readonly items: string;     // "Элементов:"
}

export interface ActionLabels {
  readonly loadMore: string;
  readonly showMore: string;
  readonly showLess: string;
  readonly readMore: string;
  readonly explore: string;    // Reusable "Изучить"
  readonly viewAll: string;    // Reusable "Посмотреть все"
  readonly backTo: string;     // Reusable "Вернуться к"
}

export interface StatusLabels {
  readonly loading: string;
  readonly error: string;
  readonly notFound: string;
  readonly empty: string;      // Reusable empty state
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
  readonly breadcrumbSeparator: string; // "→" or "/" 
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
// CONTENT SECTIONS - Compact and template-driven
// ===================================================================

export interface ContentTemplates {
  readonly pageTitle: string;              // "{section} — {siteName}"
  readonly collectionTitle: string;        // "Все {section}"  
  readonly itemInCollection: string;       // "{item} в {collection}"
  readonly itemByAuthor: string;           // "{item} автора {author}"
  readonly emptyCollection: string;        // "В {collection} пока нет {items}"
  readonly totalCount: string;             // "Всего: {count} {countLabel}"
}

export interface SectionLabels {
  readonly articles: string;       // "статьи"
  readonly rubrics: string;        // "рубрики" 
  readonly authors: string;        // "авторы"
  readonly collection: string;     // "коллекция"
  readonly catalog: string;        // "каталог"
}

export interface SectionsTranslations {
  readonly labels: SectionLabels;
  readonly templates: ContentTemplates;
}

// ===================================================================
// SEO - Template-driven and compact
// ===================================================================

export interface SEOSiteInfo {
  readonly name: string;
  readonly fullName: string;
  readonly description: string;
  readonly url: string;
  readonly contactEmail: string;
  readonly socialProfiles: readonly string[];
}

export interface SEORegional {
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
  readonly base: string;               // Core keywords for all pages
  readonly rubrics: string;            // Rubric-specific keywords  
  readonly articles: string;           // Article-specific keywords
  readonly authors: string;            // Author-specific keywords
}

export interface SEODictionary {
  readonly site: SEOSiteInfo;
  readonly templates: SEOTemplates;
  readonly keywords: SEOKeywords;
  readonly regional: SEORegional;
}

// ===================================================================
// ACCESSIBILITY - Template-driven
// ===================================================================

export interface AccessibilityTemplates {
  readonly iconAlt: string;            // "Иконка {item}"
  readonly linkTitle: string;          // "{action} {item}"
  readonly pageDescription: string;    // "{description} на {siteName}"
}

export interface Accessibility {
  readonly templates: AccessibilityTemplates;
  readonly skipToContent: string;
  readonly mainNavigation: string;
  readonly currentPage: string;
}

// ===================================================================
// SEARCH & FOOTER - Simple interfaces
// ===================================================================

export interface SearchDictionary {
  readonly placeholder: string;
  readonly noResults: string;
  readonly searching: string;
  readonly labels: {
    readonly results: string;
  };
}

export interface FooterDictionary {
  readonly copyright: string;
  readonly about: string;
}

// ===================================================================
// MAIN DICTIONARY - Complete and simplified
// ===================================================================

export interface Dictionary {
  readonly navigation: NavigationDictionary;
  readonly common: CommonDictionary;
  readonly sections: SectionsTranslations;
  readonly seo: SEODictionary;
  readonly accessibility: Accessibility;
  readonly search: SearchDictionary;
  readonly footer: FooterDictionary;
}

// ===================================================================
// UTILITY TYPES - Simplified
// ===================================================================

export type SEOPageType = 'home' | 'article' | 'rubric' | 'author' | 'search' | 'collection';

export interface TemplateVariables {
  readonly siteName?: string;
  readonly title?: string;
  readonly page?: string;
  readonly section?: string;
  readonly collection?: string;
  readonly item?: string;
  readonly items?: string;        // For plural items like "статей", "рубрик"
  readonly author?: string;
  readonly query?: string;
  readonly count?: string;
  readonly countLabel?: string;
  readonly action?: string;
  readonly description?: string;
}

export type TemplateProcessor = (template: string, variables: TemplateVariables) => string;