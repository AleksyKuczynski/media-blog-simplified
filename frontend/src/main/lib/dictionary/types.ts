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
export interface HomeSectionLabels {
  readonly welcomeTitle: string;        //  'Добро пожаловать в EventForMe',
  readonly welcomeDescription: string;        //  'Медиа о культурных событиях, искусстве и творческих инициативах',
  readonly featuredContent: string;        //  'Избранное',
  readonly latestUpdates: string;        //  'Последние обновления',
  readonly exploreRubrics: string;        //  'Изучить рубрики',
  readonly viewAllRubrics: string;        //  'Посмотреть все рубрики',
  readonly featuredRubrics: string;        //  'Избранные рубрики',
  readonly featuredDescription: string;        //  'Рекомендуемые материалы',
  readonly rubricsDescription: string;        //  'Откройте для себя тематические разделы',
  readonly rubricsSectionDescription: string;        //  'Наши рубрики охватывают все аспекты культурной жизни',
  readonly viewAllRubricsDescription: string;        //  'Полный каталог всех доступных рубрик',
  readonly quickNavigation: string;        //  'Быстрая навигация',
}
export interface AuthorsTranslations {
  // ... existing properties ...
  readonly collectionPageDescription: string;  // 'Познакомьтесь с нашими авторами и экспертами, которые пишут о культурных событиях и современных идеях.'
}
export interface RubricsSectionLabels {
  readonly allRubrics: string;        //  'Все рубрики',
  readonly featuredRubric: string;        //  'Избранная рубрика',
  readonly articlesInRubric: string;        //  'Статьи в рубрике',
  readonly rubricList: string;        //  'Список рубрик',
  readonly noRubricsAvailable: string;        //  'Рубрики пока недоступны',
  readonly iconAltText: string;        //  'Иконка рубрики',
  readonly noIcon: string;        //  'Без иконки',
  readonly rubricIcon: string;        //  'Иконка рубрики',
  readonly checkBackLater: string;        //  'Загляните позже',
  readonly readMoreAbout: string;        //  'Читать больше о',
  readonly exploreRubric: string;        //  'Изучить рубрику', // CRITICAL: Missing entry
  readonly rubricsCatalog: string;        //  'Каталог рубрик',
  readonly browseAllRubrics: string;        //  'Просмотреть все рубрики',
  readonly categoriesDescription: string;        //  'Исследуйте наши тематические рубрики',
  readonly totalRubrics: string;        //  'Всего рубрик',
  readonly rubricCard: string;        //  'Карточка рубрики',
  readonly viewRubricDetails: string;        //  'Посмотреть детали рубрики',
  readonly articlesCount: string;        //  'Статей в рубрике',
  readonly enterRubric: string;        //  'Войти в рубрику',
  readonly discoverContent: string;        //  'Открыть содержимое',
  readonly moreDetails: string;        //  'Подробнее',
  readonly collectionPageDescription: string;  // 'Изучите наши тематические рубрики и найдите интересные статьи о культурных событиях, музыке и современных идеях.'
}

export interface ArticlesLabels {
  readonly allArticles: string;       // 'Все статьи',
  readonly featuredArticles: string;       // 'Избранные статьи',
  readonly latestArticles: string;       // 'Последние статьи',
  readonly noArticlesFound: string;       // 'Статьи не найдены',
  readonly noFeaturedArticles: string;       // 'Нет избранных статей',
  readonly moreArticlesToLoad: string;       // 'Есть ещё статьи для загрузки',
  readonly loadMore: string;       // 'Загрузить ещё статьи',
  readonly loadingArticles: string;       // 'Загружаются статьи...',
  readonly errorLoadingArticles: string;       // 'Ошибка при загрузке статей',
  readonly articlesInCategory: string;       // 'Статьи в категории',
  readonly articlesInRubric: string;       // 'Статьи в рубрике',
  readonly articlesByAuthor: string;       // 'Статьи автора',
  readonly collectionPageDescription: string;  // 'Читайте все статьи о культурных событиях, музыке, современных идеях и мистических явлениях.'
}

export interface SectionsTranslations {
  readonly labels: SectionLabels;
  readonly templates: ContentTemplates;
  readonly home: HomeSectionLabels;
  readonly authors: AuthorsTranslations
  readonly rubrics: RubricsSectionLabels;
  readonly articles: ArticlesLabels;
}

// ===================================================================
// SEO - Template-driven and compact
// ===================================================================

export interface SEOSiteInfo {
  readonly name: string;
  readonly fullName: string;
  readonly description: string;
  readonly organizationDescription: string; // For structured data
  readonly url: string;
  readonly contactEmail: string;
  readonly socialProfiles: readonly string[];
  readonly geographicAreas: readonly string[]; // For schema.org
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
  readonly iconDescription: string;       // 'Иконка рубрики',
  readonly decorativeIcon: string;       // 'Декоративная иконка',
  readonly rubricVisualIndicator: string;       // 'Визуальный индикатор рубрики',
  readonly rubricDescription: string;       // 'Описание рубрики',
  readonly expandDescription: string;       // 'Развернуть описание',
  readonly articlesList: string;       // 'Список статей',
  readonly articlesGrid: string;       // 'Сетка статей',
  readonly loadMoreButton: string;       // 'Загрузить больше статей',
  readonly loadingContent: string;       // 'Загружается содержимое',
  readonly emptyState: string;       // 'Пустое состояние',
  readonly errorState: string;       // 'Состояние ошибки',
  readonly retryAction: string;       // 'Повторить действие',
  readonly totalPages: string;       // 'Всего страниц',
  readonly articleCard: string;       // 'Карточка статьи',
  readonly articleLink: string;       // 'Ссылка на статью',
  readonly publishedDate: string;       // 'Дата публикации',
  readonly authorInfo: string;       // 'Информация об авторе',
  readonly categoryInfo: string;       // 'Информация о категории',
}

// ===================================================================
// SEARCH - Complete interfaces
// ===================================================================

export interface SearchLabels {
  readonly placeholder: string;
  readonly submit: string;
  readonly results: string;
  readonly noResults: string;
  readonly searching: string;
  readonly minCharacters: string;
  readonly foundResults: string;      // "Найдено результатов:"
}

export interface SearchTemplates {
  readonly resultsFor: string;         // "Результаты для {query}"
  readonly pageTitle: string;          // "Поиск"
  readonly pageDescription: string;    // "Поиск статей и материалов"
  readonly relatedTo: string;          // "связанные с"
  readonly resultsCount: string;       // "{count} {label}" for count formatting
}

export interface SearchAccessibility {
  readonly searchLabel: string;
  readonly searchButtonLabel: string;
  readonly clearSearchLabel: string;
  readonly searchInputLabel: string;
  readonly searchDescription: string;
  readonly searchResultsLabel: string;
}

export interface SearchInterface {
  readonly alternativeNavigation: string;
  readonly searchSuggestion: string;
  readonly popularRubrics: string;
  readonly latestArticles: string;
  readonly ourAuthors: string;
}

export interface SearchNavigation {
  readonly popularRubrics: string;
  readonly latestArticles: string;
  readonly ourAuthors: string;
}

export interface SearchDictionary {
  readonly labels: SearchLabels;
  readonly templates: SearchTemplates;
  readonly accessibility: SearchAccessibility;
  readonly interface: SearchInterface;
  readonly navigation: SearchNavigation;
}

// ===================================================================
// FOOTER - Complete interface for Footer component
// ===================================================================

export interface FooterAbout {
  readonly title: string;        // "О проекте"
  readonly description: string;  // Project description text
}

export interface FooterQuickLinks {
  readonly title: string;        // "Быстрые ссылки"
  readonly ariaLabel: string;    // "Навигация по сайту" (replaces hardcoded)
}

export interface FooterSocialLinks {
  readonly title: string;        // "Социальные сети"
}

export interface FooterLegal {
  readonly copyright: string;    // Copyright template "© {year} {siteName}"
  readonly rights: string;       // Rights statement
}

export interface FooterDictionary {
  readonly about: FooterAbout;
  readonly quickLinks: FooterQuickLinks;
  readonly socialLinks: FooterSocialLinks;
  readonly legal: FooterLegal;
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
  readonly filter: FilterDictionary;
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