// src/main/lib/dictionaries.ts - Enhanced with comprehensive SEO entries
import 'server-only'
import { Dictionary, Lang } from './dictionaries/dictionariesTypes';

// Enhanced Russian dictionary with comprehensive SEO optimization
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
      general: 'события, культура, музыка, идеи, тайны, медиа, статьи, интервью, блог, развлечения, искусство, культурные мероприятия',
    }
  },

  sections: {
    home: {
      welcomeTitle: 'EventForMe',
      welcomeDescription: 'Ведущий медиа-проект о культурных событиях, музыке, современных идеях и тайнах мира',
      featuredContent: 'Рекомендуемые материалы', 
      latestUpdates: 'Новые публикации',
      exploreRubrics: 'Изучить рубрики',
      viewAllRubrics: 'Просмотреть все рубрики',
      
      // Enhanced SEO-optimized descriptions
      featuredDescription: 'Самые актуальные и интересные материалы нашей редакции — читайте лучшие статьи о культуре, музыке и современных трендах',
      rubricsDescription: 'Изучите наши тематические рубрики и найдите интересующие вас темы — от музыки до тайн современного мира',
      viewAllRubricsDescription: 'Перейти к полному списку всех доступных рубрик на сайте',
      quickNavigation: 'Быстрая навигация по странице',
    },
    
    articles: {
      allArticles: 'Все статьи',
      featuredArticles: 'Рекомендуемые статьи',
      latestArticles: 'Последние статьи',
      noArticlesFound: 'Статьи не найдены.',
      noFeaturedArticles: 'В данный момент нет рекомендуемых статей.',
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
      featuredRubric: 'Рекомендуемая рубрика',
      articlesInRubric: 'статей в рубрике',
      rubricList: 'Список рубрик',
      noRubricsAvailable: 'В данный момент рубрики недоступны.',
    }
  },

  sorting: {
    sortOrder: 'Порядок',
    newest: 'От новых',
    oldest: 'От старых'
  },

  filter: {
    all: 'Все',
    category: 'Категория',
    author: 'Автор',
    date: 'Дата'
  },

  categories: {
    all: 'Все категории',
    music: 'Музыка',
    events: 'События',
    culture: 'Культура',
    ideas: 'Идеи',
    mystic: 'Тайны'
  }
};

// Single source of truth - export the dictionary getter
export async function getDictionary(locale: Lang): Promise<Dictionary> {
  // Always return Russian dictionary since we're Russian-focused
  return RUSSIAN_DICTIONARY;
}

// Helper function to get Russian pluralization for article count
export function getRussianArticleCount(count: number): string {
  const dict = RUSSIAN_DICTIONARY.common.articles;
  
  if (count % 10 === 1 && count % 100 !== 11) {
    return `${count} ${dict.one}`;
  } else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
    return `${count} ${dict.few}`;
  } else {
    return `${count} ${dict.many}`;
  }
}