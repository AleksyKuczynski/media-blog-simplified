// src/main/lib/constants/russianStrings.ts

/**
 * Static Russian translations to replace the dynamic dictionary system
 * Extracted from ru.json and converted to TypeScript constants
 */
export const RUSSIAN_STRINGS = {
  navigation: {
    home: 'Главная',
    rubrics: 'Рубрики',
    authors: 'Авторы', 
    search: 'Поиск',
    articles: 'Статьи'
  },
  
  footer: {
    about: {
      title: 'О проекте',
      description: 'Медиа-проект о событиях и культуре'
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
    readingTime: 'время чтения'
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

  sections: {
    home: {
      welcome: 'Добро пожаловать',
      featuredContent: 'Рекомендуемое',
      latestUpdates: 'Последние обновления'
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
      featuredRubric: 'Рубрика в фокусе',
      rubricList: 'Список рубрик'
    }
  },

  sorting: {
    sortOrder: 'Порядок',
    newest: 'От новых',
    oldest: 'От старых'
  },

  filter: {
    reset: 'Сброс'
  },

  categories: {
    categories: 'Категория',
    allCategories: 'Все категории',
    selectCategory: 'Выберите категорию'
  },

  themes: {
    name: 'Стиль',
    default: '«Компьютер»',
    rounded: '«Смартфон»',
    sharp: '«Газета»'
  },

  colors: {
    name: 'Цветовая тема',
    default: 'Нормальная',
    scheme1: 'Холодная', 
    scheme2: 'Теплая'
  }
} as const;

// Type helpers for better TypeScript support
export type RussianStringKey = keyof typeof RUSSIAN_STRINGS;
export type NavigationString = keyof typeof RUSSIAN_STRINGS.navigation;
export type SearchString = keyof typeof RUSSIAN_STRINGS.search;