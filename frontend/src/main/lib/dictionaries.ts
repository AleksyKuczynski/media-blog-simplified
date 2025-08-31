// src/main/lib/dictionaries.ts - Enhanced with Missing Navigation Keys
import 'server-only'
import { Dictionary, Lang } from './dictionaries/dictionariesTypes';

// Enhanced Russian dictionary with comprehensive SEO optimization and missing navigation keys
const RUSSIAN_DICTIONARY: Dictionary = {
  navigation: {
    home: 'Главная',
    rubrics: 'Рубрики',
    authors: 'Авторы',
    search: 'Поиск',
    articles: 'Статьи',
    // ✅ NEW: Missing navigation keys added
    logoAlt: 'EventForMe - медиа о культурных событиях',
    primarySections: 'Основные разделы сайта',
    currentPage: 'Текущая страница',
    mainNavigation: 'Главная навигация',
    menuTitle: 'Навигационное меню',
    menuDescription: 'Навигация по основным разделам сайта EventForMe',
    openMenu: 'Открыть меню',
    closeMenu: 'Закрыть меню',
    // ✅ NEW: Skip links translations
    skipToContent: 'Перейти к основному содержанию',
    skipToNavigation: 'Перейти к навигации',
    skipToSearch: 'Перейти к поиску',
    skipToFooter: 'Перейти к подвалу сайта',
    keyboardNavigationLabel: 'Быстрая навигация для клавиатуры',
    clearSearch: 'Очистить поиск',
    focusSearch: 'Фокус на поиске'
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
      designedWithLove: 'Создано с ❤️ в'
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
    // Russian pluralization for articles
    articles: {
      one: 'статья',
      few: 'статьи', 
      many: 'статей'
    }
  },

  search: {
    placeholder: 'Поиск статей...',
    searching: 'Поиск...',
    noResults: 'Результатов не найдено',
    results: 'Результаты поиска',
    resultsFor: 'Результаты для "{query}"',
    pageTitle: 'Поиск',
    pageDescription: 'Поиск статей по всем разделам блога EventForMe',
    relatedTo: 'связанные с',
    submit: 'Поиск',
    minCharacters: 'Введите минимум 3 символа'
  },

  // Enhanced SEO section optimized for Google and Yandex
  seo: {
    siteName: 'EventForMe',
    titles: {
      homePrefix: 'EventForMe — Медиа о культурных событиях, музыке и идеях',
      homeSuffix: 'Главная',
    },
    descriptions: {
      home: 'EventForMe — ведущий медиа-проект о культурных событиях, музыке, современных идеях и тайнах мира. Читайте актуальные статьи и интервью с экспертами в области культуры.',
    },
    keywords: {
      general: 'культурные события, музыка, современные идеи, медиа, EventForMe, культура, развлечения',
    },
  },

  sections: {
    home: {
      welcomeTitle: 'Добро пожаловать в EventForMe',
      welcomeDescription: 'Ваш источник актуальной информации о культурных событиях, музыке и современных идеях',
      featuredContent: 'Рекомендуемые материалы',
      latestUpdates: 'Последние обновления',
      exploreRubrics: 'Исследуйте рубрики',
      viewAllRubrics: 'Все рубрики',
      featuredDescription: 'Лучшие статьи и материалы, отобранные нашей редакцией',
      rubricsDescription: 'Тематические разделы для более удобной навигации по контенту',
      viewAllRubricsDescription: 'Просмотрите все доступные тематические рубрики',
      quickNavigation: 'Быстрая навигация по странице'
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
      noRubricsAvailable: 'Рубрики недоступны'
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
    date: 'По дате'
  },

  categories: {
    all: 'Все категории',
    music: 'Музыка',
    events: 'События',
    culture: 'Культура',
    ideas: 'Идеи',
    mystic: 'Мистика'
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