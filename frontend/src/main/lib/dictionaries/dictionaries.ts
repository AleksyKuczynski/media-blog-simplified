// src/main/lib/dictionaries/dictionaries.ts - Enhanced with Missing Navigation Keys
import 'server-only'
import { Dictionary, Lang } from './dictionariesTypes';

// Enhanced Russian dictionary with comprehensive SEO optimization and missing navigation keys
const RUSSIAN_DICTIONARY: Dictionary = {
  navigation: {
    home: 'Главная',
    rubrics: 'Рубрики',
    authors: 'Авторы',
    search: 'Поиск',
    articles: 'Статьи',
    logoAlt: 'EventForMe - медиа о культурных событиях',
    primarySections: 'Основные разделы сайта',
    currentPage: 'Текущая страница',
    mainNavigation: 'Главная навигация',
    menuTitle: 'Навигационное меню',
    menuDescription: 'Навигация по основным разделам сайта EventForMe',
    openMenu: 'Открыть меню',
    closeMenu: 'Закрыть меню',
    skipToContent: 'Перейти к основному содержанию',
    skipToNavigation: 'Перейти к навигации',
    skipToSearch: 'Перейти к поиску',
    skipToFooter: 'Перейти к подвалу сайта',
    keyboardNavigationLabel: 'Быстрая навигация для клавиатуры',
    clearSearch: 'Очистить поиск',
    focusSearch: 'Фокус на поиске',
    articlesDescription: 'Просмотреть все статьи и публикации на сайте EventForMe',
    rubricsDescription: 'Изучить тематические рубрики и разделы контента',
    authorsDescription: 'Познакомиться с нашими авторами и экспертами',
    primarySectionsLabel: 'Основные разделы сайта',
    mainMenuLabel: 'Главное меню',
    searchAndSettingsLabel: 'Поиск и настройки',
    siteSearchLabel: 'Поиск по сайту',
    logoMainPageLabel: 'EventForMe - главная страница',
    homepageDescription: 'Главная страница EventForMe с последними новостями о культурных событиях, музыке и современных идеях'
  },
  
  search: {
    placeholder: 'Поиск статей...',
    searching: 'Поиск...',
    noResults: 'Результатов не найдено',
    results: 'Результаты поиска',
    resultsFor: 'Результаты для "{query}"',
    pageTitle: 'Поиск',
    pageDescription: 'Поиск статей',
    relatedTo: 'связанные с',
    submit: 'Поиск',
    minCharacters: 'Введите минимум 3 символа'
  },
  
  footer: {
    about: {
      title: 'О проекте',
      description: 'EventForMe — ведущий медиа-проект о культурных событиях, музыке, современных идеях и тайнах мира'
    },
    quickLinks: {
      title: 'Быстрые ссылки'
    },
    socialLinks: {
      title: 'Мы в соцсетях'
    },
    contact: {
      faq: 'Часто задаваемые вопросы',
      helpCenter: 'Центр помощи'
    },
    credentials: {
      copyright: 'Все права защищены.',
      privacyPolicy: 'Политика конфиденциальности',
      termsOfService: 'Условия использования'
    },
    kuKraft: {
      designedWithLove: 'Разработано с любовью командой KuKraft'
    }
  },

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
    loadMore: 'Загрузить еще',
    editorial: 'Редакционная статья',
    tableOfContents: 'Содержание',
    // Russian pluralization support
    articles: {
      one: 'статья',   // 1 статья
      few: 'статьи',   // 2-4 статьи  
      many: 'статей'   // 5+ статей
    }
  },

  sections: {
    home: {
      welcomeTitle: 'Добро пожаловать в EventForMe',
      welcomeDescription: 'Медиа о культурных событиях, музыке и современных идеях',
      featuredContent: 'Рекомендуемое',
      latestUpdates: 'Последние обновления',
      exploreRubrics: 'Изучайте рубрики',
      viewAllRubrics: 'Все рубрики',
      featuredDescription: 'Самые интересные материалы, выбранные редакцией',
      featuredRubrics: "Наши рубрики",
      rubricsDescription: "Изучите разнообразные темы и найдите статьи, которые вас интересуют",
      rubricsSectionDescription: "Изучите разнообразные темы и найдите статьи, которые вас интересуют",
      viewAllRubricsDescription: "Просмотреть полный список всех доступных рубрик на сайте",
      quickNavigation: 'Быстрая навигация'
    },
    articles: {
      allArticles: 'Все статьи',
      featuredArticles: 'Рекомендуемые статьи',
      latestArticles: 'Последние статьи',
      noArticlesFound: 'Статьи не найдены.',
      noFeaturedArticles: 'Нет рекомендуемых статей.',
      moreArticlesToLoad: 'Есть еще статьи для загрузки...',
      loadMore: 'Загрузить еще'
    },
    authors: {
      allAuthors: 'Все авторы',
      ourAuthors: 'Наши авторы',
      noAuthorsFound: 'Авторы не найдены.',
      moreAuthorsToLoad: 'Есть еще авторы для загрузки...'
    },
    author: {
      noArticlesFound: 'Статьи этого автора не найдены.',
      articlesByAuthor: 'Статьи автора {author}',
      authorProfile: 'Профиль автора',
      articlesWrittenBy: 'Статьи, написанные автором {author}'
    },
    categories: {
      allCategories: 'Все категории',
      noArticlesFound: 'Статьи этой категории не найдены.'
    },
    rubrics: {
      allRubrics: 'Все рубрики',
      featuredRubric: 'Избранная рубрика',
      articlesInRubric: 'статей в рубрике',
      rubricList: 'Список рубрик',
      noRubricsAvailable: 'Рубрики недоступны',
      iconAltText: "Иконка рубрики",
      noIcon: "Без иконки",
      rubricIcon: "Иконка рубрики {{name}}",
      checkBackLater: "Пожалуйста, зайдите позже",
      readMoreAbout: "Читать больше о",
      exploreRubric: "Изучить рубрику",
    }
  },

  sorting: {
    sortOrder: 'Сортировка',
    newest: 'Сначала новые',
    oldest: 'Сначала старые'
  },

  filter: {
    all: 'Все',
    category: 'По категории',
    author: 'По автору',
    date: 'По дате',
    reset: 'Сброс'
  },

  categories: {
    all: 'Все категории',
    music: 'Музыка',
    events: 'События',
    culture: 'Культура',
    ideas: 'Идеи',
    mystic: 'Мистика',
    allCategories: 'Все категории'
  },

  accessibility: {
    // ... existing accessibility entries ...
    iconDescription: "Иконка для рубрики {{rubricName}}",
    decorativeIcon: "Декоративная иконка",
    rubricVisualIndicator: "Визуальный индикатор рубрики",
    rubricDescription: "Описание рубрики {{rubricName}}",
    expandDescription: "Развернуть описание",
    // ... existing entries ...
  },

  seo: {
    siteName: 'EventForMe',
    titles: {
      homePrefix: 'EventForMe',
      homeSuffix: 'Медиа о культурных событиях',
      // ✅ NEW: Template-based titles for consistency
      articleTemplate: '{title} - EventForMe',
      rubricTemplate: 'Рубрика {rubric} - EventForMe', 
      authorTemplate: 'Автор {author} - EventForMe',
      searchTemplate: 'Поиск - EventForMe'
    },
    descriptions: {
      home: 'EventForMe — ведущий медиа-проект о культурных событиях, музыке, современных идеях и тайнах мира',
      // ✅ NEW: Template-based descriptions
      articleTemplate: 'Читать статью "{title}" на EventForMe - медиа о культуре, музыке и современных идеях',
      rubricTemplate: 'Все статьи в рубрике {rubric} на EventForMe - медиа о культурных событиях',
      authorTemplate: 'Статьи автора {author} на EventForMe - читать все публикации', 
      searchTemplate: 'Поиск статей по культурным событиям, музыке и современным идеям на EventForMe'
    },
    keywords: {
      general: 'культурные события, музыка, современные идеи, мистика, культура',
      // ✅ NEW: Specialized keywords by category
      articles: 'статьи о культуре, музыкальные обзоры, культурная журналистика, EventForMe',
      rubrics: 'рубрики о культуре, тематические разделы, культурные категории',
      authors: 'авторы о культуре, культурные эксперты, музыкальные журналисты',
      music: 'музыка, музыкальные события, концерты, фестивали, музыкальные обзоры',
      culture: 'культура, культурные события, искусство, театр, выставки',
      events: 'события, мероприятия, фестивали, концерты, культурная афиша',
      mystic: 'мистика, эзотерика, тайны, необычные явления, мистические события'
    },
    // ✅ NEW: Structured data configuration
    structuredData: {
      organizationName: 'EventForMe',
      organizationDescription: 'Ведущий медиа-проект о культурных событиях, музыке, современных идеях и тайнах мира',
      contactEmail: 'info@event4me.eu',
      socialProfiles: [
        'https://t.me/eventforme',
        'https://vk.com/eventforme'
      ],
      geographicAreas: ['Russia', 'Belarus', 'Kazakhstan', 'Ukraine', 'EU']
    }
  }
};

const dictionaries = {
  ru: RUSSIAN_DICTIONARY,
} as const;

export function getDictionary(locale: Lang): Promise<Dictionary> {
  return Promise.resolve(dictionaries[locale]);
}

// Helper function for Russian pluralization
export function getRussianArticleCount(count: number): string {
  const dict = RUSSIAN_DICTIONARY;
  
  if (count % 10 === 1 && count % 100 !== 11) {
    return `${count} ${dict.common.articles.one}`;
  } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return `${count} ${dict.common.articles.few}`;
  } else {
    return `${count} ${dict.common.articles.many}`;
  }
}

// Helper function for generating icon alt text
export function getRubricIconAlt(rubricName: string): string {
  return `Иконка рубрики ${rubricName}`;
}

// Helper function for icon accessibility description
export function getRubricIconDescription(rubricName: string): string {
  return `Визуальный индикатор для рубрики "${rubricName}"`;
}

// ✅ NEW: Helper function for description truncation
export function truncateDescription(description: string, maxLength: number = 120): string {
  if (description.length <= maxLength) return description;
  
  const truncated = description.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}