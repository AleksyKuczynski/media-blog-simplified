// src/main/lib/dictionary/dictionary.ts
// ENHANCED: Added metadata, errors, and content sections to eliminate hardcoded text

import { Dictionary } from './types';

/**
 * Complete Russian dictionary - enhanced with metadata fallbacks and error handling
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
  // METADATA - NEW: Structured metadata fallbacks
  // ===================================================================
  metadata: {
    notFound: {
      article: {
        title: 'Статья не найдена',
        description: 'Запрашиваемая статья не найдена',
      },
      rubric: {
        title: 'Рубрика не найдена',
        description: 'Запрашиваемая рубрика не найдена',
      },
      author: {
        title: 'Автор не найден',
        description: 'Запрашиваемый автор не найден',
      },
      page: {
        title: 'Страница не найдена',
        description: 'Запрашиваемая страница не найдена',
      },
    },
  },

  // ===================================================================
  // ERRORS - NEW: Template-driven error handling
  // ===================================================================
  errors: {
    templates: {
      loadingError: 'Ошибка загрузки {contentType}',
      loadingDescription: 'Произошла ошибка при загрузке {contentType}. Попробуйте обновить страницу.',
      retryAction: 'Попробовать снова',
      backToHome: 'Вернуться на главную',
    },
    types: {
      article: 'статьи',
      rubric: 'рубрики',
      author: 'автора',
      page: 'страницы',
      content: 'контента',
    },
  },

  // ===================================================================
  // CONTENT - NEW: Content-specific labels and templates
  // ===================================================================
  content: {
    labels: {
      tableOfContents: 'Содержание',
      editorial: 'Редакция {siteName}',
      readingTime: 'Время чтения: {minutes} мин',
      wordsCount: 'Слов: {count}',
    },
    templates: {
      emptyRubric: 'В рубрике {name} пока нет статей',
      moreAbout: 'Больше о {contentType} {name}',
      writtenBy: 'Автор: {author}',
      publishedIn: 'Опубликовано в {rubric}',
    },
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
      browseAllRubrics: 'Просмотр всех рубрик',
      categoriesDescription: 'Изучите наши тематические категории',
      collectionPageDescription: 'Исследуйте наши рубрики и найдите интересующие вас темы о культуре и искусстве',
      noRubricsAvailable: 'Пока нет доступных рубрик',
      checkBackLater: 'Заходите позже',
      readMoreAbout: 'Читать больше о',
      exploreRubric: 'Изучить рубрику',
      iconAltText: 'Иконка рубрики',
      noIcon: 'Нет иконки',
      rubricIcon: 'Иконка рубрики {item}',
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
      byAuthor: 'от автора',
      inRubric: 'в рубрике',
    },
  },

  // ===================================================================
  // SEO - Enhanced with not found description
  // ===================================================================
  seo: {
    site: {
      name: 'EventForMe',
      fullName: 'EventForMe — Медиа о культуре и искусстве',
      description: 'Медиа-платформа о культурных событиях, современном искусстве и творческих инициативах в России и мире',
      organizationDescription: 'EventForMe — независимая медиа-платформа, освещающая актуальные культурные события, художественные проекты и творческие инициативы',
      url: 'https://event4me.eu',
      contactEmail: 'contact@event4me.eu',
      socialProfiles: [
        'https://t.me/eventforme',
        'https://vk.com/eventforme',
        'https://instagram.com/eventforme'
      ],
      geographicAreas: ['Россия', 'Европа'],
    },
    regional: {
      language: 'ru',
      region: 'RU',
      targetMarkets: ['Россия', 'СНГ', 'Европа'],
    },
    templates: {
      pageTitle: '{title} — {siteName}',
      metaDescription: '{description} на {siteName}',
      collectionPage: '{collection} — {siteName}',
      notFoundDescription: 'Запрашиваемая страница не найдена на {siteName}',
    },
    keywords: {
      base: 'EventForMe, культура, искусство, события, Россия',
      articles: 'статьи, материалы, публикации, контент',
      rubrics: 'рубрики, категории, темы, разделы',
      authors: 'авторы, эксперты, журналисты, редакция',
    },
  },

  // ===================================================================
  // SEARCH - Complete search interface
  // ===================================================================
  search: {
    labels: {
      placeholder: 'Поиск статей, авторов, рубрик...',
      results: 'Результаты',
      noResults: 'Ничего не найдено',
      searching: 'Поиск...',
      submit: 'Найти',
      minCharacters: 'Введите минимум 2 символа',
    },
    templates: {
      resultsFor: 'Результаты поиска для "{query}"',
      pageTitle: 'Поиск',
      pageDescription: 'Поиск статей, авторов и рубрик',
      relatedTo: 'Связанные с "{query}"',
    },
    accessibility: {
      searchLabel: 'Поиск по сайту',
      searchButtonLabel: 'Выполнить поиск',
      searchInputLabel: 'Введите поисковый запрос',
    },
  },

  // ===================================================================
  // FILTER - Filter and sorting interface
  // ===================================================================
  filter: {
    labels: {
      sortBy: 'Сортировать по',
      category: 'Категория',
      allCategories: 'Все категории',
      newest: 'Сначала новые',
      oldest: 'Сначала старые',
      alphabetical: 'По алфавиту',
      reset: 'Сбросить',
      apply: 'Применить',
    },
    accessibility: {
      sortingControl: 'Управление сортировкой',
      resetButton: 'Сбросить фильтры',
      filterGroup: 'Группа фильтров',
      dropdownLabel: 'Выпадающий список',
    },
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
  // FOOTER - Complete footer structure
  // ===================================================================
  footer: {
    about: {
      title: 'О проекте',
      description: 'EventForMe — медиа о культурных событиях и современном искусстве',
    },
    quickLinks: {
      title: 'Быстрые ссылки',
      ariaLabel: 'Навигация по основным разделам сайта',
    },
    socialLinks: {
      title: 'Социальные сети',
    },
    legal: {
      copyright: '© {year} {siteName}. Все права защищены.',
      rights: 'Все права защищены',
    },
  },
};

export default dictionary;