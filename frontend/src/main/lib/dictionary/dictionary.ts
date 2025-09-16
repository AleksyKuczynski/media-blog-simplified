// src/main/lib/dictionary/dictionary.ts
// FIXED: Added missing navigation accessibility properties

import { Dictionary } from './types';

export const russianDictionary: Dictionary = {
  // ===================================================================
  // NAVIGATION - Complete with accessibility
  // ===================================================================
  navigation: {
    labels: {
      home: 'Главная',
      articles: 'Статьи', 
      rubrics: 'Рубрики',
      authors: 'Авторы',
      search: 'Поиск',
    },
    descriptions: {
      home: 'Главная страница EventForMe — медиа о культурных событиях',
      articles: 'Статьи о музыке, искусстве и культурных событиях',
      rubrics: 'Тематические рубрики EventForMe по направлениям культуры',
      authors: 'Авторы EventForMe — журналисты и экспертыпо культуре',
      search: 'Поиск статей и материалов на EventForMe',
    },
    templates: {
      pageTitle: '{page} — {siteName}',
      sectionDescription: '{action} {section} на {siteName}',
      breadcrumbSeparator: '→',
    },
    accessibility: {
      mainNavigation: 'Главная навигация',
      menuTitle: 'Навигационное меню',
      menuDescription: 'Навигация по основным разделам сайта EventForMe',
      openMenu: 'Открыть меню',
      closeMenu: 'Закрыть меню',
      logoAlt: 'EventForMe — медиа о культурных событиях',
      logoMainPageLabel: 'EventForMe — главная страница',
      primarySectionsLabel: 'Основные разделы сайта',
      mainMenuLabel: 'Главное меню',
      searchAndSettingsLabel: 'Поиск и настройки',
      siteSearchLabel: 'Поиск по сайту',
      skipToContent: 'Перейти к основному содержанию',
      skipToNavigation: 'Перейти к навигации',
    },
  },

  // ===================================================================
  // COMMON - Simple count labels, no pluralization complexity
  // ===================================================================
  common: {
    count: {
      articles: 'Статей:',      // Always plural: "Статей: 1", "Статей: 5"
      rubrics: 'Рубрик:',       // Always plural: "Рубрик: 3"
      authors: 'Авторов:',      // Always plural: "Авторов: 12"
      results: 'Результатов:',  // Always plural: "Результатов: 0"
      items: 'Элементов:',      // Generic count
    },
    actions: {
      loadMore: 'Загрузить еще',
      showMore: 'Показать больше',
      showLess: 'Показать меньше', 
      readMore: 'Читать далее',
      explore: 'Изучить',           // Reusable
      viewAll: 'Посмотреть все',    // Reusable
      backTo: 'Вернуться к',        // Reusable
    },
    status: {
      loading: 'Загрузка...',
      error: 'Произошла ошибка',
      notFound: 'Не найдено',
      empty: 'Пока пусто',          // Reusable empty state
      retry: 'Попробовать снова',
    },
    published: 'Опубликовано',
    updated: 'Обновлено',
  },

  // ===================================================================
  // SECTIONS - Template-driven and compact
  // ===================================================================
  sections: {
    labels: {
      articles: 'статьи',       // lowercase for templates
      rubrics: 'рубрики',       // lowercase for templates
      authors: 'авторы',        // lowercase for templates
      collection: 'коллекция',  // Generic term
      catalog: 'каталог',       // Alternative to collection
    },
    templates: {
      pageTitle: '{section} — {siteName}',
      collectionTitle: 'Все {section}',        // "Все рубрики"
      itemInCollection: '{item} в {collection}', // "Статья в рубрике"
      itemByAuthor: '{item} автора {author}',   // "Статьи автора Иван"
      emptyCollection: 'В {collection} пока нет {items}',
      totalCount: 'Всего: {count} {countLabel}',
    },
    home: {
      welcomeTitle: 'Добро пожаловать в EventForMe',
      welcomeDescription: 'Медиа о культурных событиях, искусстве и творческих инициативах',
      featuredContent: 'Избранное',
      latestUpdates: 'Последние обновления',
      exploreRubrics: 'Изучить рубрики',
      viewAllRubrics: 'Посмотреть все рубрики',
      featuredRubrics: 'Избранные рубрики',
      featuredDescription: 'Рекомендуемые материалы',
      rubricsDescription: 'Откройте для себя тематические разделы',
      rubricsSectionDescription: 'Наши рубрики охватывают все аспекты культурной жизни',
      viewAllRubricsDescription: 'Полный каталог всех доступных рубрик',
      quickNavigation: 'Быстрая навигация',
    },
    rubrics: {
      allRubrics: 'Все рубрики',
      featuredRubric: 'Избранная рубрика',
      articlesInRubric: 'Статьи в рубрике',
      rubricList: 'Список рубрик',
      noRubricsAvailable: 'Рубрики пока недоступны',
      iconAltText: 'Иконка рубрики',
      noIcon: 'Без иконки',
      rubricIcon: 'Иконка рубрики',
      checkBackLater: 'Загляните позже',
      readMoreAbout: 'Читать больше о',
      exploreRubric: 'Изучить рубрику', // CRITICAL: Missing entry
      rubricsCatalog: 'Каталог рубрик',
      browseAllRubrics: 'Просмотреть все рубрики',
      categoriesDescription: 'Исследуйте наши тематические рубрики',
      totalRubrics: 'Всего рубрик',
      rubricCard: 'Карточка рубрики',
      viewRubricDetails: 'Посмотреть детали рубрики',
      articlesCount: 'Статей в рубрике',
      enterRubric: 'Войти в рубрику',
      discoverContent: 'Открыть содержимое',
      moreDetails: 'Подробнее',
      collectionPageDescription: 'Изучите наши тематические рубрики и найдите интересные статьи о культурных событиях, музыке и современных идеях.',
    },
    authors: {
      // ... existing properties ...
      collectionPageDescription: 'Познакомьтесь с нашими авторами и экспертами, которые пишут о культурных событиях и современных идеях.',
    },
    articles: {
      allArticles: 'Все статьи',
      featuredArticles: 'Избранные статьи',
      latestArticles: 'Последние статьи',
      noArticlesFound: 'Статьи не найдены',
      noFeaturedArticles: 'Нет избранных статей',
      moreArticlesToLoad: 'Есть ещё статьи для загрузки',
      loadMore: 'Загрузить ещё статьи', // Specific to articles
      loadingArticles: 'Загружаются статьи...',
      errorLoadingArticles: 'Ошибка при загрузке статей',
      articlesInCategory: 'Статьи в категории',
      articlesInRubric: 'Статьи в рубрике',
      articlesByAuthor: 'Статьи автора',
      collectionPageDescription: 'Читайте все статьи о культурных событиях, музыке, современных идеях и мистических явлениях.',
    },
  },

  // ===================================================================
  // SEO - Complete site information
  // ===================================================================
  seo: {
    site: {
      name: 'EventForMe',
      fullName: 'EventForMe - Медиа о культурных событиях',
      description: 'Медиа о культурных событиях и творческих инициативах',
      organizationDescription: 'Медиаплатформа, посвященная культурным событиям, искусству и творческим инициативам в России',
      url: 'https://event4me.eu',
      contactEmail: 'info@event4me.eu',
      socialProfiles: [
        'https://t.me/event4me_eu',
        'https://vk.com/event4me_eu',
      ],
      geographicAreas: ['Russia', 'Europe'],
    },
    templates: {
      pageTitle: '{title} — {siteName}',
      metaDescription: '{description} на {siteName}',
      collectionPage: '{collection} — {siteName}', 
      itemPage: '{item} — {siteName}',
      searchPage: 'Поиск: {query} — {siteName}',
    },
    keywords: {
      base: 'культурные события, музыка, современные идеи, медиа',
      rubrics: 'рубрики, темы, категории, разделы',
      articles: 'статьи, публикации, материалы, контент',
      authors: 'авторы, эксперты, журналисты, блогеры',
    },
    regional: {
      language: 'ru',
      region: 'Россия',
      targetMarkets: ['Россия', 'СНГ', 'русскоязычное сообщество'],
    },
  },

  // ===================================================================
  // SEARCH - Simple search labels
  // ===================================================================
  search: {
    labels: {
      placeholder: 'Поиск статей...',
      submit: 'Найти',
      results: 'Результаты поиска',
      noResults: 'Ничего не найдено',
      searching: 'Поиск...',
      minCharacters: 'Введите минимум 3 символа',
      foundResults: 'Найдено результатов:', // For count display
    },
    templates: {
      resultsFor: 'Результаты для {query}',
      pageTitle: 'Поиск',
      pageDescription: 'Поиск статей и материалов',
      relatedTo: 'связанные с',
      resultsCount: '{count} {label}', // For result count formatting
    },
    accessibility: {
      searchLabel: 'Поиск по сайту',
      searchButtonLabel: 'Начать поиск',
      clearSearchLabel: 'Очистить поиск',
      searchInputLabel: 'Введите поисковый запрос',
      searchDescription: 'Поиск статей, рубрик и авторов',
      searchResultsLabel: 'Результаты поиска',
    },
    interface: {
      alternativeNavigation: 'Альтернативная навигация',
      searchSuggestion: 'Попробуйте поискать что-то другое',
      popularRubrics: 'Популярные рубрики',
      latestArticles: 'Последние статьи',
      ourAuthors: 'Наши авторы',
    },
    navigation: {
      popularRubrics: 'Популярные рубрики',
      latestArticles: 'Последние статьи',
      ourAuthors: 'Наши авторы',
    },
  },

  // ===================================================================
  // FILTER & SORTING - Simple filter functionality
  // ===================================================================
  filter: {
    allCategories: 'Все категории',
    category: 'Категория', 
    sortOrder: 'Сортировка',
    reset: 'Сброс',
    newest: 'Сначала новые',
    oldest: 'Сначала старые',
    // Accessibility
    categorySelector: 'Выбор категории',
    sortingControl: 'Управление сортировкой', 
    resetButton: 'Сбросить фильтры',
    filterGroup: 'Группа фильтров',
    dropdownLabel: 'Меню фильтров',
  },

  // ===================================================================
  // FOOTER - Minimal footer content
  // ===================================================================
  footer: {
    about: {
      title: 'О проекте',
      description: 'Медиа о культурных событиях, искусстве и творческих инициативах. Открываем новые грани культурного пространства.',
    },
    quickLinks: {
      title: 'Навигация',
      ariaLabel: 'Навигация по сайту', // Replaces hardcoded "Быстрая навигация"
    },
    socialLinks: {
      title: 'Социальные сети',
    },
    legal: {
      copyright: '© {year} {siteName}',
      rights: 'Медиа о культурных событиях.',
    },
  },

  // ===================================================================
  // ACCESSIBILITY - Template-driven accessibility
  // ===================================================================
  accessibility: {
    templates: {
      iconAlt: 'Иконка {item}',
      linkTitle: '{action} {item}',
      pageDescription: '{description} на {siteName}',
    },
    skipToContent: 'Перейти к основному содержанию',
    mainNavigation: 'Главная навигация',
    currentPage: 'Текущая страница',
    iconDescription: 'Иконка рубрики',
    decorativeIcon: 'Декоративная иконка',
    rubricVisualIndicator: 'Визуальный индикатор рубрики',
    rubricDescription: 'Описание рубрики',
    expandDescription: 'Развернуть описание',
    articlesList: 'Список статей',
    articlesGrid: 'Сетка статей',
    loadMoreButton: 'Загрузить больше статей',
    loadingContent: 'Загружается содержимое',
    emptyState: 'Пустое состояние',
    errorState: 'Состояние ошибки',
    retryAction: 'Повторить действие',
    totalPages: 'Всего страниц',
    articleCard: 'Карточка статьи',
    articleLink: 'Ссылка на статью',
    publishedDate: 'Дата публикации',
    authorInfo: 'Информация об авторе',
    categoryInfo: 'Информация о категории',
  },
};

/**
 * Main dictionary getter - returns Russian dictionary
 * This replaces the old getDictionary function
 */
export const getDictionary = async (lang: 'ru' = 'ru'): Promise<Dictionary> => {
  return russianDictionary;
};

export default russianDictionary;