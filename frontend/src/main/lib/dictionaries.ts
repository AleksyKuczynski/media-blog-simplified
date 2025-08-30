// src/main/lib/dictionaries.ts - FIXED
import 'server-only'
import { Dictionary, Lang } from './dictionaries/dictionariesTypes';

// ✅ Static Russian dictionary - UPDATED to match new Dictionary interface
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
    tableOfContents: 'Содержание'
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

  seo: {
    siteName: 'EventForMe',
    titles: {
      homePrefix: 'EventForMe - Медиа о событиях и культуре',
      homeSuffix: 'Главная',
    },
    descriptions: {
      home: 'EventForMe - ведущий медиа-проект о культурных событиях, музыке, идеях и тайнах. Читайте актуальные статьи и интервью с экспертами.',
    },
    keywords: {
      general: 'события, культура, музыка, идеи, тайны, медиа, статьи, интервью, блог',
    }
  },

  sections: {
    home: {
      // Keep your existing entries and add these:
      welcomeTitle: 'Добро пожаловать',
      welcomeDescription: 'EventForMe — медиа-проект о культурных событиях, музыке, современных идеях и тайнах мира',
      featuredContent: 'Рекомендуемые материалы', 
      latestUpdates:  'Новые публикации',
      exploreRubrics: 'Изучить рубрики',
      viewAllRubrics: 'Просмотреть все рубрики',
      // SEO-optimized descriptions for better semantic content
      featuredDescription: 'Самые актуальные и интересные материалы нашей редакции',
      rubricsDescription: 'Изучите наши тематические рубрики и найдите интересующие вас темы',
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
      articlesInRubric: 'статей в рубрике', // For "5 статей в рубрике"
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