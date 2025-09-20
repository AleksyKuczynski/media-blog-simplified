// src/main/lib/dictionary/dictionary.ts
// COMPLETE: Clean, DRY dictionary optimized for SEO and maintainability

import { Dictionary } from './types';

/**
 * Complete Russian dictionary - optimized for minimal size and maximum reusability
 * Uses templates extensively to avoid duplication and support multiple contexts
 * Optimized for both Google and Yandex SEO requirements
 */
const dictionary: Dictionary = {
  // ===================================================================
  // NAVIGATION - Complete structured navigation
  // ===================================================================
  navigation: {
    labels: {
      home: 'Главная',
      articles: 'Статьи',
      rubrics: 'Рубрики',
      authors: 'Авторы',
      search: 'Поиск',
    },
    templates: {
      pageTitle: '{page} — {siteName}',
      sectionDescription: '{action} {section} на {siteName}',
      breadcrumbSeparator: '→',
    },
    descriptions: {
      home: 'Главная страница сайта',
      articles: 'Все статьи о культуре и искусстве',
      rubrics: 'Тематические разделы и категории',
      authors: 'Наши авторы и эксперты',
      search: 'Поиск по всем материалам сайта',
    },
    accessibility: {
      mainNavigation: 'Основная навигация',
      menuTitle: 'Меню сайта',
      menuDescription: 'Навигация по основным разделам',
      openMenu: 'Открыть меню',
      closeMenu: 'Закрыть меню',
      logoAlt: 'Логотип EventForMe',
      logoMainPageLabel: 'Перейти на главную страницу',
      primarySectionsLabel: 'Основные разделы',
      mainMenuLabel: 'Главное меню',
      searchAndSettingsLabel: 'Поиск и настройки',
      siteSearchLabel: 'Поиск по сайту',
      skipToContent: 'Перейти к содержимому',
      skipToNavigation: 'Перейти к навигации',
    },
  },

  // ===================================================================
  // COMMON - Simple, reusable labels without pluralization
  // ===================================================================
  common: {
    count: {
      articles: 'Статей:',
      rubrics: 'Рубрик:',
      authors: 'Авторов:',
      results: 'Результатов:',
      items: 'Элементов:',
    },
    actions: {
      loadMore: 'Загрузить еще',
      showMore: 'Показать больше',
      showLess: 'Показать меньше',
      readMore: 'Читать далее',
      explore: 'Изучить',
      viewAll: 'Посмотреть все',
      backTo: 'Вернуться к',
    },
    status: {
      loading: 'Загрузка...',
      error: 'Произошла ошибка',
      notFound: 'Не найдено',
      empty: 'Пока пусто',
      retry: 'Попробовать снова',
    },
    published: 'Опубликовано',
    updated: 'Обновлено',
  },

  // ===================================================================
  // SECTIONS - Template-driven, reusable across content types
  // ===================================================================
  sections: {
    labels: {
      articles: 'статьи',
      rubrics: 'рубрики',
      authors: 'авторы',
      collection: 'коллекция',
      catalog: 'каталог',
    },
    templates: {
      pageTitle: '{section} — {siteName}',
      collectionTitle: 'Все {section}',
      itemInCollection: '{item} в {collection}',
      itemByAuthor: '{item} автора {author}',
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
    authors: {
      allAuthors: 'Все авторы',
      ourAuthors: 'Наши авторы',
      noAuthorsFound: 'Авторы не найдены',
      moreAuthorsToLoad: 'Еще авторы для загрузки',
      collectionPageDescription: 'Познакомьтесь с нашими авторами и экспертами, которые создают контент о культурных событиях и современных идеях',
      profileDescription: 'Профиль автора и его публикации',
      articlesWrittenBy: 'Статьи автора {author}',
    },
    rubrics: {
      allRubrics: 'Все рубрики',
      featuredRubric: 'Избранная рубрика',
      articlesInRubric: 'Статьи в рубрике',
      rubricList: 'Список рубрик',
      rubricsCatalog: 'Каталог рубрик',
      browseAllRubrics: 'Просмотреть все рубрики',
      categoriesDescription: 'Изучайте материалы по тематическим направлениям — от музыки и культуры до современных идей и мистики',
      collectionPageDescription: 'Изучите наши тематические рубрики, охватывающие все аспекты культурной жизни и современного искусства',
      noRubricsAvailable: 'Рубрики пока недоступны',
      checkBackLater: 'Заходите позже',
      readMoreAbout: 'Читать подробнее о',
      exploreRubric: 'Изучить рубрику',
      iconAltText: 'Иконка рубрики',
      noIcon: 'Нет иконки',
      rubricIcon: 'Иконка рубрики {name}',
    },
    articles: {
      allArticles: 'Все статьи',
      featuredArticles: 'Избранные статьи',
      latestArticles: 'Последние статьи',
      noArticlesFound: 'Статьи не найдены',
      noFeaturedArticles: 'Нет избранных статей',
      moreArticlesToLoad: 'Еще статьи для загрузки',
      loadMore: 'Загрузить еще',
      collectionPageDescription: 'Читайте наши статьи о культурных событиях, искусстве и творческих инициативах',
      byAuthor: 'Статьи автора {author}',
      inRubric: 'Статьи в рубрике {rubric}',
    },
  },

  // ===================================================================
  // SEO - Comprehensive, template-driven SEO optimization
  // ===================================================================
  seo: {
    site: {
      name: 'EventForMe',
      fullName: 'EventForMe — Медиа о культуре и искусстве',
      description: 'Медиа о культурных событиях, искусстве и творческих инициативах. Рубрики о музыке, культуре, событиях и современных идеях.',
      organizationDescription: 'EventForMe — это медиа-платформа, посвященная освещению культурных событий, современного искусства и творческих инициатив в России и мире.',
      url: 'https://event4me.eu',
      contactEmail: 'info@event4me.eu',
      socialProfiles: [
        'https://t.me/event4me',
        'https://vk.com/event4me',
        'https://instagram.com/event4me'
      ],
      geographicAreas: ['Russia', 'Belarus', 'Kazakhstan', 'European Union'],
    },
    templates: {
      pageTitle: '{title} — {siteName}',
      metaDescription: '{description} на {siteName}',
      collectionPage: '{collection} — {siteName}',
      itemPage: '{item} — {siteName}',
      searchPage: 'Поиск: {query} — {siteName}',
    },
    keywords: {
      base: 'культурные события, искусство, творчество, медиа, EventForMe',
      rubrics: 'рубрики, тематические разделы, категории, культура',
      articles: 'статьи, публикации, материалы, контент',
      authors: 'авторы, эксперты, журналисты, редакторы',
      music: 'музыка, концерты, фестивали, музыкальные события',
      culture: 'культура, театр, выставки, культурные события',
      events: 'события, мероприятия, афиша, культурная жизнь',
      mystic: 'мистика, эзотерика, духовность, философия',
    },
    regional: {
      language: 'ru',
      region: 'RU',
      targetMarkets: ['Russia', 'Belarus', 'Kazakhstan'],
    },
  },

  // ===================================================================
  // SEARCH - Complete search interface
  // ===================================================================
  search: {
    labels: {
      placeholder: 'Поиск по сайту',
      results: 'Результаты поиска',
      noResults: 'Ничего не найдено',
      searching: 'Поиск...',
      submit: 'Найти',
      minCharacters: 'Минимум 2 символа',
      queryTerm: 'Поисковый запрос',        // Unified for both navigation and search
      searchAction: 'Поиск по сайту',
    },
    templates: {
      resultsFor: 'Результаты поиска: {query}',
      pageTitle: 'Поиск',
      pageDescription: 'Найдите интересующий вас контент',
      relatedTo: 'Связанные материалы',
    },
    accessibility: {
      searchLabel: 'Поиск по сайту',
      searchButtonLabel: 'Выполнить поиск',
      searchInputLabel: 'Введите поисковый запрос',
    },
  },

  // ===================================================================
  // FILTER - Simple filtering functionality
  // ===================================================================
  filter: {
    allCategories: 'Все категории',
    category: 'Категория',
    sortOrder: 'Сортировка',
    reset: 'Сбросить',
    newest: 'Сначала новые',
    oldest: 'Сначала старые',
    categorySelector: 'Выбор категории',
    sortingControl: 'Управление сортировкой',
    resetButton: 'Сбросить фильтры',
    filterGroup: 'Группа фильтров',
    dropdownLabel: 'Выпадающий список',
  },

  // ===================================================================
  // ACCESSIBILITY - Universal accessibility labels
  // ===================================================================
  accessibility: {
    iconDescription: 'Иконка',
    decorativeIcon: 'Декоративная иконка',
    rubricVisualIndicator: 'Визуальный индикатор рубрики',
    rubricDescription: 'Описание рубрики',
    expandDescription: 'Развернуть описание',
  },

  // ===================================================================
  // FOOTER - Simple footer structure
  // ===================================================================
  footer: {
    about: {
      title: 'О проекте',
      description: 'EventForMe — медиа о культурных событиях и современном искусстве',
    },
    quickLinks: {
      title: 'Быстрые ссылки',
      ariaLabel: 'Быстрая навигация по сайту',
    },
    socialLinks: {
      title: 'Социальные сети',
    },
    legal: {
      copyright: '© {year} {siteName}',
      rights: 'Все права защищены',
    },
  },
};

export default dictionary;