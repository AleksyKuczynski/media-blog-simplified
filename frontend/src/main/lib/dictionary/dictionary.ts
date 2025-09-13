// src/main/lib/dictionary/dictionary.ts
// New parallel dictionary - Russian content with semantic organization

import { Dictionary } from './types';

// ===================================================================
// RUSSIAN DICTIONARY - Complete but DRY implementation
// ===================================================================

export const russianDictionary: Dictionary = {
  // ===================================================================
  // NAVIGATION - Central hub of site interaction
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
      home: 'Главная страница EventForMe с последними новостями о культурных событиях, музыке и современных идеях',
      articles: 'Просмотреть все статьи и публикации на сайте EventForMe о культурных событиях и современных идеях',
      rubrics: 'Изучить тематические рубрики и разделы контента: музыка, культура, события, мистика',
      authors: 'Познакомиться с нашими авторами и экспертами в области культуры и современных идей',
      search: 'Поиск статей, авторов и рубрик на сайте EventForMe',
    },

    accessibility: {
      logoAlt: 'EventForMe - медиа о культурных событиях',
      logoMainPageLabel: 'EventForMe - перейти на главную страницу',
      mainNavigation: 'Главная навигация сайта',
      primarySectionsLabel: 'Основные разделы сайта',
      mainMenuLabel: 'Главное меню',
      searchAndSettingsLabel: 'Поиск и настройки',
      siteSearchLabel: 'Поиск по сайту',
      skipToContent: 'Перейти к основному содержанию',
      skipToNavigation: 'Перейти к навигации',
      skipToSearch: 'Перейти к поиску',
      skipToFooter: 'Перейти к подвалу сайта',
      openMenu: 'Открыть меню',
      closeMenu: 'Закрыть меню',
      menuTitle: 'Навигационное меню',
      menuDescription: 'Навигация по основным разделам сайта EventForMe',
      keyboardNavigationLabel: 'Быстрая навигация с клавиатуры',
      currentPage: 'Текущая страница',
      clearSearch: 'Очистить поисковый запрос',
      focusSearch: 'Перейти к поисковой строке',
    },

    seo: {
      navigationTitle: 'Навигация по разделам EventForMe',
      navigationDescription: 'Основные разделы медиа-платформы EventForMe: статьи, рубрики, авторы, поиск',
      websiteSearchTitle: 'Поиск по сайту EventForMe',
      websiteSearchDescription: 'Поиск статей, авторов и контента на медиа-платформе EventForMe',
      geographicAreas: ['Russia', 'Belarus', 'Kazakhstan', 'Ukraine'],
      audience: 'Русскоязычная аудитория, интересующаяся культурными событиями и современными идеями',
    },
  },

  // ===================================================================
  // COMMON - Common interface elements
  // ===================================================================
  common: {
    loading: 'Загрузка...',
    readMore: 'Читать далее',
    showMore: 'Показать больше',
    showLess: 'Показать меньше',
    published: 'Опубликовано',
    by: 'Автор',
    in: 'в',
    minutes: 'мин',
    readingTime: 'время чтения',
    loadMore: 'Загрузить ещё',
    editorial: 'Редакционная статья',
    tableOfContents: 'Содержание',
    noResults: 'Результаты не найдены',
    noContent: 'Контент недоступен',
    backToTop: 'Наверх',
    
    pagination: {
      page: 'Страница',
      of: 'из',
      next: 'Следующая',
      previous: 'Предыдущая',
    },

    articles: {
      one: 'статья',
      few: 'статьи',
      many: 'статей',
    },
  },

  // ===================================================================
  // SEARCH - User discovery and content exploration
  // ===================================================================
  search: {
    labels: {
      placeholder: 'Поиск статей, авторов, рубрик...',
      submit: 'Найти',
      results: 'Результаты поиска',
      noResults: 'Ничего не найдено',
      searching: 'Поиск...',
      minCharacters: 'Введите минимум 3 символа',
    },

    templates: {
      resultsFor: 'Результаты поиска по запросу "{query}"',
      pageTitle: 'Поиск - EventForMe',
      pageDescription: 'Поиск статей, авторов и контента на EventForMe',
      relatedTo: 'связанные с',
      noResultsDescription: 'Результаты не найдены. Попробуйте изменить поисковый запрос',
      resultsSummary: '{count} {resultWord} для запроса "{query}"',
    },

    accessibility: {
      searchLabel: 'Поиск по сайту',
      searchDescription: 'Введите ключевые слова для поиска статей, авторов или рубрик',
      searchInputLabel: 'Поле ввода поискового запроса',
      searchButtonLabel: 'Выполнить поиск',
      searchResultsLabel: 'Результаты поиска',
      noResultsAnnouncement: 'По вашему запросу ничего не найдено. Попробуйте изменить поисковые слова.',
      searchingAnnouncement: 'Выполняется поиск, пожалуйста подождите...',
      clearSearchLabel: 'Очистить поисковый запрос',
    },

    messages: {
      searchQuery: 'Поисковый запрос',
      foundResults: 'Найдено',
      tryFollowing: 'Попробуйте',
      checkSpelling: 'Проверить правописание запроса',
      useGeneralTerms: 'Использовать более общие термины',
      trySynonyms: 'Попробовать синонимы',
    },

    interface: {
      title: 'Поиск по контенту EventForMe',
      description: 'Используйте поисковую строку выше, чтобы найти интересующие вас статьи, авторов или рубрики',
      alternativeNavigation: 'Или перейдите к рубрикам для просмотра контента по темам',
    },

    navigation: {
      popularRubrics: 'Популярные рубрики',
      latestArticles: 'Последние статьи',
      ourAuthors: 'Наши авторы',
      viewAllArticles: 'Посмотреть все статьи',
      meetAuthors: 'Познакомиться с авторами',
    },

    pluralization: {
      result: {
        one: 'результат',
        few: 'результата',
        many: 'результатов',
      },
    },

    schema: {
      searchActionDescription: 'Поиск статей, авторов и рубрик на EventForMe',
      searchInterfaceDescription: 'Форма поиска по контенту EventForMe',
      breadcrumbNavigation: 'Навигационная цепочка',
      searchResultsDescription: 'Результаты поиска на EventForMe',
      searchResultsList: 'Список результатов поиска',
      searchResultsFound: 'найденных результатов о культуре и событиях',
      mentionedInSearch: 'Статья найдена по запросу',
    },

  },

  // ===================================================================
  // SECTIONS - Complete section-specific translations
  // ===================================================================
  sections: {
    home: {
      welcomeTitle: 'Добро пожаловать на EventForMe',
      welcomeDescription: 'Медиа о культурных событиях, музыке и современных идеях',
      featuredContent: 'Рекомендуемое',
      latestUpdates: 'Последние обновления',
      exploreRubrics: 'Изучить рубрики',
      viewAllRubrics: 'Все рубрики',
      featuredRubrics: 'Рекомендуемые рубрики',
      featuredDescription: 'Лучшие материалы наших авторов',
      rubricsDescription: 'Тематические разделы контента',
      rubricsSectionDescription: 'Познакомьтесь с нашими тематическими рубриками',
      viewAllRubricsDescription: 'Посмотреть полный каталог рубрик',
      quickNavigation: 'Быстрая навигация',
    },

    articles: {
      allArticles: 'Все статьи',
      featuredArticles: 'Рекомендуемые статьи',
      latestArticles: 'Последние статьи',
      noArticlesFound: 'Статьи не найдены',
      noFeaturedArticles: 'Нет рекомендуемых статей',
      moreArticlesToLoad: 'Есть еще статьи для загрузки',
      loadMore: 'Загрузить еще',
    },

    authors: {
      allAuthors: 'Все авторы',
      ourAuthors: 'Наши авторы',
      noAuthorsFound: 'Авторы не найдены',
      moreAuthorsToLoad: 'Есть еще авторы для загрузки',
    },

    author: {
      noArticlesFound: 'Статьи этого автора не найдены',
      articlesByAuthor: 'Статьи автора',
      authorProfile: 'Профиль автора',
      articlesWrittenBy: 'Статьи, написанные автором',
    },

    categories: {
      allCategories: 'Все категории',
      noArticlesFound: 'Статьи этой категории не найдены',
    },

    rubrics: {
      allRubrics: 'Все рубрики',
      featuredRubric: 'Рекомендуемая рубрика',
      articlesInRubric: 'Статьи в рубрике',
      rubricList: 'Список рубрик',
      noRubricsAvailable: 'Рубрики недоступны',
      iconAltText: 'Иконка рубрики',
      noIcon: 'Без иконки',
      rubricIcon: 'Иконка рубрики',
      checkBackLater: 'Загляните позже',
      readMoreAbout: 'Читать больше о',
      exploreRubric: 'Изучить рубрику',
      rubricsCatalog: 'Каталог рубрик',
      browseAllRubrics: 'Просмотреть все рубрики',
      categoriesDescription: 'Тематические категории контента',
      totalRubrics: 'Всего рубрик',
      rubricCard: 'Карточка рубрики',
      viewRubricDetails: 'Посмотреть детали рубрики',
    },
  },

  // ===================================================================
  // SORTING - Sorting interface translations
  // ===================================================================
  sorting: {
    sortOrder: 'Порядок сортировки',
    newest: 'Сначала новые',
    oldest: 'Сначала старые',
  },

  // ===================================================================
  // FILTER - Filter interface translations
  // ===================================================================
  filter: {
    all: 'Все',
    category: 'Категория',
    author: 'Автор',
    date: 'Дата',
    reset: 'Сбросить',
  },

  // ===================================================================
  // CATEGORIES - Content category translations
  // ===================================================================
  categories: {
    all: 'Все',
    music: 'Музыка',
    events: 'События',
    culture: 'Культура',
    ideas: 'Идеи',
    mystic: 'Мистика',
    allCategories: 'Все категории',
  },

  // ===================================================================
  // ACCESSIBILITY - Accessibility labels and descriptions
  // ===================================================================
  accessibility: {
    iconDescription: 'Иконка',
    decorativeIcon: 'Декоративная иконка',
    rubricVisualIndicator: 'Визуальный индикатор рубрики',
    rubricDescription: 'Описание рубрики',
    expandDescription: 'Развернуть описание',
  },

  // ===================================================================
  // FOOTER - Footer content
  // ===================================================================
  footer: {
    about: {
      title: 'О проекте',
      description: 'EventForMe — медиа-проект о культурных событиях, музыке и современных идеях',
    },
    quickLinks: {
      title: 'Быстрые ссылки',
    },
    socialLinks: {
      title: 'Мы в соцсетях',
    },
    contact: {
      faq: 'Часто задаваемые вопросы',
      helpCenter: 'Центр помощи',
    },
  },

  // ===================================================================
  // SEO - Complete Russian market optimization
  // ===================================================================
  seo: {
    site: {
      name: 'EventForMe',
      fullName: 'EventForMe — Медиа о культурных событиях',
      description: 'Ведущий медиа-проект о культурных событиях, музыке, современных идеях и тайнах мира',
      url: 'https://event4me.eu',
      contactEmail: 'info@event4me.eu',
      socialProfiles: [
        'https://t.me/eventforme',
        'https://vk.com/eventforme'
      ],
      organizationDescription: 'Ведущий медиа-проект о культурных событиях, музыке, современных идеях и тайнах мира',
      geographicAreas: ['Russia', 'Belarus', 'Kazakhstan', 'Ukraine', 'EU'],
    },

    titles: {
      homePrefix: 'EventForMe — Медиа о культурных событиях',
      homeSuffix: 'музыка, идеи, культура',
      articleTemplate: '{title} — EventForMe',
      rubricTemplate: '{rubric} — EventForMe', 
      authorTemplate: 'Статьи {author} — EventForMe',
      searchTemplate: 'Поиск: {query} — EventForMe',
      rubricsListTitle: 'Все рубрики — EventForMe',
      rubricsList: 'Каталог рубрик — EventForMe',
    },

    descriptions: {
      home: 'EventForMe — ведущий медиа-проект о культурных событиях, музыке, современных идеях и тайнах мира. Актуальные статьи, экспертные мнения, культурная аналитика.',
      articleTemplate: 'Читать статью "{title}" на EventForMe — медиа о культурных событиях, музыке и современных идеях',
      rubricTemplate: 'Все статьи в рубрике "{rubric}" на EventForMe — актуальные материалы о культурных событиях и современных идеях',
      authorTemplate: 'Статьи автора {author} на EventForMe — экспертные материалы о культуре, музыке и современных идеях',
      searchTemplate: 'Поиск статей, авторов и рубрик на EventForMe — медиа о культурных событиях и современных идеях',
      rubricsList: 'Полный каталог тематических рубрик EventForMe: музыка, культура, события, идеи, мистика',
    },

    keywords: {
      general: 'культурные события, музыка, современные идеи, культура, EventForMe, медиа, аналитика, экспертные мнения',
      articles: 'статьи о культуре, культурная аналитика, музыкальные обзоры, современные тренды',
      rubrics: 'рубрики, тематические разделы, категории статей, культурные темы',
      authors: 'авторы, эксперты, культурные критики, музыкальные журналисты',
      rubricsList: 'каталог рубрик, тематические разделы, культурные категории, навигация по темам',
      music: 'музыка, музыкальные события, концерты, артисты, альбомы, музыкальная индустрия',
      culture: 'культура, культурные события, искусство, выставки, театр, кино, литература',
      events: 'события, мероприятия, фестивали, концерты, выставки, культурная программа',
      mystic: 'мистика, тайны, загадки, эзотерика, необъяснимые явления, мистические истории',
    },

    regional: {
      language: 'ru',
      region: 'RU',
      geographicCoverage: 'Russia',
      targetMarkets: ['Russia', 'Belarus', 'Kazakhstan', 'Ukraine'],
    },

    // Structured data configuration
    structuredData: {
      organizationName: 'EventForMe',
      organizationDescription: 'Ведущий медиа-проект о культурных событиях, музыке, современных идеях и тайнах мира',
      contactEmail: 'info@event4me.eu',
      socialProfiles: [
        'https://t.me/eventforme',
        'https://vk.com/eventforme'
      ],
      geographicAreas: ['Russia', 'Belarus', 'Kazakhstan', 'Ukraine', 'EU'],
      rubricsCollection: {
        name: 'Рубрики EventForMe',
        description: 'Полный каталог тематических рубрик медиа-проекта EventForMe о культурных событиях',
        numberOfItems: 'Количество рубрик',
        itemListElement: 'Элемент каталога рубрик',
      },
    },
  },
} as const;