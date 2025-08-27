// src/main/lib/dictionaries.ts
import 'server-only'
import { Dictionary, Lang } from './dictionaries/dictionariesTypes';

// ✅ Static Russian dictionary - complete with all required keys
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
    },
    // ✅ ADDED: Simplified footer translations (Phase 4 compliance)
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
    loadMore: 'Загрузить еще', // ✅ MOVED: From sections.articles to common for reusability
    editorial: 'Редакционная статья', // ✅ ADDED: Editorial text
    tableOfContents: 'Содержание' // ✅ ADDED: Table of contents text
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
  }
};

// ✅ SIMPLIFIED: Always return Russian dictionary, ignore lang parameter
export const getDictionary = async (locale: Lang): Promise<Dictionary> => {
  return RUSSIAN_DICTIONARY;
};