// src/main/lib/dictionary/dictionary.ts
// SIMPLIFIED: No pluralization, compact and template-driven

import { Dictionary } from './types';

export const russianDictionary: Dictionary = {
  // ===================================================================
  // NAVIGATION - Clean and simple
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
  },

  // ===================================================================
  // COMMON - Simple count labels, no pluralization complexity
  // ===================================================================
  common: {
    count: {
      articles: 'Статей:',      // Always plural: "Статей: 1", "Статей: 5"
      rubrics: 'Рубрик:',       // Always plural: "Рубрик: 3"
      authors: 'Авторов:',      // Always plural: "Авторов: 12"
      results: 'Результатов:',  // Always plural: "Результатов: 0"
      items: 'Элементов:',      // Generic count
    },
    actions: {
      loadMore: 'Загрузить еще',
      showMore: 'Показать больше',
      showLess: 'Показать меньше', 
      readMore: 'Читать далее',
      explore: 'Изучить',           // Reusable
      viewAll: 'Посмотреть все',    // Reusable
      backTo: 'Вернуться к',        // Reusable
    },
    status: {
      loading: 'Загрузка...',
      error: 'Произошла ошибка',
      notFound: 'Не найдено',
      empty: 'Пока пусто',          // Reusable empty state
      retry: 'Попробовать снова',
    },
    published: 'Опубликовано',
    updated: 'Обновлено',
  },

  // ===================================================================
  // SECTIONS - Template-driven and compact
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
      collectionTitle: 'Все {section}',                    // "Все рубрики"
      itemInCollection: '{item} в {collection}',           // "Статьи в рубрике"
      itemByAuthor: '{item} автора {author}',             // "Статьи автора Иван"
      emptyCollection: 'В {collection} пока нет {items}',  // "В рубрике пока нет статей"
      totalCount: 'Всего: {count} {countLabel}',          // "Всего: 5 Статей:"
    },
  },

  // ===================================================================
  // SEO - Compact templates for consistent metadata
  // ===================================================================
  seo: {
    site: {
      name: 'EventForMe',
      fullName: 'EventForMe — Культурные события и современные идеи',
      description: 'Ведущий медиа-проект о культурных событиях, музыке, современных идеях и тайнах мира',
      url: 'https://event4me.eu',
      contactEmail: 'info@event4me.eu',
      socialProfiles: [
        'https://t.me/eventforme',
        'https://vk.com/eventforme'
      ],
    },
    templates: {
      pageTitle: '{title} — {siteName}',
      metaDescription: '{description} на {siteName}',
      collectionPage: '{collection} — {siteName}',           // "Все рубрики — EventForMe"
      itemPage: '{item} — {siteName}',                       // "Музыка — EventForMe"
      searchPage: 'Поиск: {query} — {siteName}',
    },
    keywords: {
      base: 'культурные события, музыка, современные идеи, EventForMe',
      rubrics: 'рубрики, разделы, тематические материалы',
      articles: 'статьи, публикации, материалы',
      authors: 'авторы, журналисты, эксперты',
    },
  },

  // ===================================================================
  // ACCESSIBILITY - Template-driven for consistency  
  // ===================================================================
  accessibility: {
    templates: {
      iconAlt: 'Иконка {item}',                    // "Иконка рубрики"
      linkTitle: '{action} {item}',                // "Изучить рубрику"  
      pageDescription: '{description} на {siteName}',
    },
    skipToContent: 'Перейти к содержанию',
    mainNavigation: 'Главная навигация',
    currentPage: 'Текущая страница',
  },

  // ===================================================================
  // SIMPLE SECTIONS - No unnecessary complexity
  // ===================================================================
  search: {
    placeholder: 'Поиск статей...',
    noResults: 'Результатов не найдено',
    searching: 'Поиск...',
  },

  footer: {
    copyright: 'Все права защищены',
    about: 'О проекте',
  },
};

// ===================================================================
// SIMPLE HELPER FUNCTIONS - No pluralization complexity
// ===================================================================

/**
 * Format count with simple label - no pluralization
 * @example formatCount(5, 'статей') => "Статей: 5"
 */
export const formatCount = (count: number, label: string): string => {
  return `${label} ${count}`;
};

/**
 * Process template with variables - simplified version
 * @example processTemplate('Все {section}', { section: 'рубрики' }) => "Все рубрики"
 */
export const processTemplate = (template: string, variables: Record<string, string>): string => {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  });
  return result;
};

/**
 * Get dictionary with locale support (currently only Russian)
 */
export const getDictionary = (locale: 'ru'): Promise<Dictionary> => {
  return Promise.resolve(russianDictionary);
};

export default russianDictionary;