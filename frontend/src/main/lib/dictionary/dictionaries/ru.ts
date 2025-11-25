// src/main/lib/dictionary/dictionary.ts

import { CONTACT_EMAIL, SITE_URL } from "../../constants/constants";
import Dictionary from "../types";


/**
 * Complete Russian dictionary - enhanced with metadata fallbacks and error handling
 * Uses templates extensively to avoid duplication and support multiple contexts
 * Optimized for both Google and Yandex SEO requirements
 */
const dictionaryRU: Dictionary = {
  locale: 'ru-RU',

  // ===================================================================
  // CONSENT - Consent banner content
  // ===================================================================
  consent: {
    title: 'Мы используем файлы cookie',
    description: 'Мы используем файлы cookie для улучшения вашего опыта, анализа трафика и персонализации контента. Вы можете принять все или настроить свои предпочтения.',
    acceptAll: 'Принять все',
    rejectAll: 'Отклонить все',
    customize: 'Настроить',
    save: 'Сохранить настройки',
    back: 'Назад',
    necessary: 'Необходимые',
    analytics: 'Аналитика',
    marketing: 'Маркетинг',
    preferences: 'Предпочтения',
    necessaryDescription: 'Эти файлы cookie обеспечивают базовую функциональность и безопасность.',
    analyticsDescription: 'Помогают нам понять, как посетители взаимодействуют с сайтом, собирая анонимную информацию.',
    marketingDescription: 'Используются для показа релевантной рекламы и измерения эффективности рекламных кампаний.',
    preferencesDescription: 'Позволяют сайту запоминать ваши предпочтения, такие как язык или регион.',
    privacyPolicy: 'Политика конфиденциальности',
    alwaysActive: 'Всегда активно',
  },

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
      authorArticles: 'Статьи автора',
      categoryArticles: 'Статьи в категории',
      featuredArticles: 'Избранные статьи',
      searchResults: 'Результаты поиска',
    },
    templates: {
      pageTitle: '{page} — {siteName}',
      sectionDescription: '{action} {section} на {siteName}',
      breadcrumbSeparator: '→',
      contextualPath: '{context} → {item}',
      authorContext: 'Автор {authorName}',
      categoryContext: 'Категория {categoryName}',
      searchContext: 'Поиск: {query}',
    },
    descriptions: {
      home: 'Главная страница сайта',
      articles: 'Все статьи о культуре и искусстве',
      rubrics: 'Тематические разделы и категории',
      authors: 'Наши авторы и эксперты',
      search: 'Поиск по всем материалам сайта',
      fromAuthor: 'Статья из профиля автора',
      fromCategory: 'Статья из категории',
      fromFeatured: 'Статья из избранного на главной',
      fromSearch: 'Статья из результатов поиска',
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
      breadcrumbNavigation: 'Навигационная цепочка',
      paginationNavigation: 'Навигация по страницам',
      pageNavigation: 'Страница {current} из {total}',
    },
  },
  
  // ===================================================================
  // BREADCRUMB - reusable labels for breadcrumbs
  // ===================================================================
  breadcrumb: {
    contexts: {
      rubric: 'rubric',
      author: 'author', 
      category: 'category',
      featured: 'featured',
      search: 'search',
      external: 'external',
      direct: 'direct',
    },
    contextAria: {
      rubricPath: 'Навигация через рубрику',
      authorPath: 'Навигация через автора',
      categoryPath: 'Навигация через категорию',
      featuredPath: 'Навигация через избранное',
      searchPath: 'Навигация через поиск',
      canonicalPath: 'Основная навигация',
    },
    templates: {
      rubricLabel: 'Рубрика {name}',
      articleLabel: 'Статья: {title}',
      authorProfile: 'Профиль автора {name}',
      categoryLabel: 'Категория {name}',
      fromRubric: 'Статья из рубрики {rubric}',
      fromArticles: 'Статья из общего списка статей',
      fromSearch: 'Статья из поиска: {title}',
      searchWithQuery: '{search}: {query}',
    },
  },

  // ===================================================================
  // COMMON - Simple, reusable labels without pluralization
  // ===================================================================
  common: {
    count: {
      articles: 'статей:',
      rubrics: 'рубрик:',
      authors: 'авторов:',
      results: 'результатов:',
      items: 'элементов:',
    },
    pagination: {
      previous: 'Назад',
      next: 'Вперёд',
      page: 'Страница',
      of: 'из',
      goToPage: 'Перейти на страницу {page}',
      currentPage: 'Текущая страница, страница {page}',
      firstPage: 'Перейти на первую страницу',
      lastPage: 'Перейти на последнюю страницу',
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
      content: {
      title: 'Контент не найден',
      description: 'Запрашиваемый контент не найден',
      },
    },
  },

  // ===================================================================
  // ERRORS - NEW: Template-driven error handling
  // ===================================================================
  errors: {
    engagement: {
      updateFailed: 'Не удалось обновить счетчики',
    },
    templates: {
      loadingError: 'Ошибка загрузки {contentType}',
      loadingDescription: 'Произошла ошибка при загрузке {contentType}. Попробуйте обновить страницу.',
      retryAction: 'Попробовать снова',
      backToHome: 'Вернуться на главную',
      criticalError: 'Произошла критическая ошибка',
      criticalDescription: 'Что-то пошло не так. Попробуйте обновить страницу.',
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
  // SHARE - Share popup content
  // ===================================================================
  share: {
    title: 'Поделиться статьей',
    platforms: {
      telegram: 'Telegram',
      whatsapp: 'WhatsApp',
      vk: 'VK',
      twitter: 'Twitter',
      facebook: 'Facebook',
      instagram: 'Instagram',
      copy: 'Copy Link',
    },
    messages: {
      linkCopied: 'Ссылка скопирована!',
      instagramCopied: 'Ссылка скопирована! Вставьте в приложение Instagram',
    },
    accessibility: {
      shareOn: 'Поделиться через {platform}',
      closeDialog: 'Закрыть окно поделиться',
    },
  },  

  // ===================================================================
  // SECTIONS - Template-driven, reusable across content types
  // ===================================================================
  sections: {
    labels: {
      articles: 'статьи',
      rubrics: 'рубрики',
      author: 'автор',
      authors: 'авторы',
      categories: 'категории',
      collection: 'коллекция',
      //catalog: 'каталог',
    },
    templates: {
      pageTitle: '{section} — {siteName}',
      collectionTitle: 'Все {section}',
      itemInCollection: '{item} в {collection}',
      itemByAuthor: '{item} автора {author}',
      collectionOf: 'Коллекция {items}',
      itemsInCollectionDescription: '{items} в коллекции {collection} на {siteName}',
      authorWorksDescription: 'Работы автора {author} на {siteName}',
      emptyCollection: 'В {collection} пока нет {items}',
      totalCount: 'Всего {countLabel} {count}',
      itemDescription: 'Статья {name}',
      categoryDescription: 'Статьи в категории {categoryName}',
      noCategoryArticles: 'В категории {categoryName} пока нет статей',
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
      authorPhoto: 'Аватар автора'
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
      url: SITE_URL,
      contactEmail: CONTACT_EMAIL,
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
      title: 'Поиск',
      placeholder: 'Поиск статей, авторов, рубрик...',
      results: 'Результаты',
      noResults: 'Ничего не найдено',
      searching: 'Поиск...',
      submit: 'Найти',
      minCharacters: 'Введите минимум 3 символа',
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
      searchDescription: 'Поиск по всем материалам сайта',
      searchResultsLabel: 'Результаты поиска',
      clearSearchLabel: 'Очистить поиск',
      openSearch: 'Открыть поиск',
      closeSearch: 'Закрыть поиск',

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
      reset: 'Сбросить',
      apply: 'Применить',
    },
    accessibility: {
      categorySelector: 'Выбор категории',
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
      title: 'Правовая информация',
      copyright: '© {year} {siteName}. Все права защищены.',
      rights: 'Все права защищены',
      privacyPolicy: 'Политика конфиденциальности',
      terms: 'Условия использования',
      sitemap: 'Карта сайта',
    },
    contact: {
      title: 'Связаться с нами',
      buttonLabel: 'Написать нам',
      emailSubject: 'Обращение с EventForMe',
      modal: {
        title: 'Свяжитесь с нами',
        emailLabel: 'Ваш email',
        emailPlaceholder: 'example@mail.com',
        subjectLabel: 'Тема сообщения',
        subjectPlaceholder: 'Напишите тему вашего обращения',
        messageLabel: 'Сообщение',
        messagePlaceholder: 'Расскажите, чем мы можем помочь...',
        submitButton: 'Отправить',
        cancelButton: 'Отмена',
        successMessage: 'Спасибо! Ваше сообщение отправлено. Мы ответим в ближайшее время.',
        errorMessage: 'Произошла ошибка. Пожалуйста, попробуйте позже или напишите на',
        emailRequired: 'Email обязателен',
        emailInvalid: 'Введите корректный email',
        subjectRequired: 'Тема обязательна',
        messageRequired: 'Сообщение обязательно',
      },
    },
    accessibility: {
      skipToFooter: 'Перейти к подвалу сайта',
      footerNavigation: 'Навигация в подвале сайта',
    },
  },
};

export default dictionaryRU;