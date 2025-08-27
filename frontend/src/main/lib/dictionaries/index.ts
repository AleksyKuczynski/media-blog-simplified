// src/main/lib/dictionaries/index.ts
// Minimal backward compatibility dictionary function

import { Lang, Dictionary } from './dictionariesTypes';

// Static Russian dictionary data
const RUSSIAN_DICTIONARY: Dictionary = {
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
      welcomeTitle: 'Добро пожаловать',
      welcomeDescription: 'Медиа-проект о событиях и культуре',
      featuredContent: 'Рекомендуемое',
      latestUpdates: 'Последние обновления',
      exploreRubrics: 'Изучить рубрики',
      viewAllRubrics: 'Просмотреть все рубрики'
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
};

/**
 * Backward compatibility function
 * Always returns Russian dictionary regardless of lang parameter
 */
export async function getDictionary(lang: Lang): Promise<Dictionary> {
  // ✅ Always return Russian dictionary
  return RUSSIAN_DICTIONARY;
}

// ✅ Export types for backward compatibility
export type { Lang, Dictionary } from './dictionariesTypes';