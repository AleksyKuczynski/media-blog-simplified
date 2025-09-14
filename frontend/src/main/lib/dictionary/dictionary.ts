// src/main/lib/dictionary/dictionary.ts
// FIXED: Added missing navigation accessibility properties

import { Dictionary } from './types';

export const russianDictionary: Dictionary = {
  // ===================================================================
  // NAVIGATION - Complete with accessibility
  // ===================================================================
  navigation: {
    labels: {
      home: 'Главная',
      articles: 'Статьи', 
      rubrics: 'Рубрики',
      authors: 'Авторы',
      search: 'Поиск',
    },
    descriptions: {
      home: 'Главная страница EventForMe — медиа о культурных событиях',
      articles: 'Статьи о музыке, искусстве и культурных событиях',
      rubrics: 'Тематические рубрики EventForMe по направлениям культуры',
      authors: 'Авторы EventForMe — журналисты и экспертыпо культуре',
      search: 'Поиск статей и материалов на EventForMe',
    },
    templates: {
      pageTitle: '{page} — {siteName}',
      sectionDescription: '{action} {section} на {siteName}',
      breadcrumbSeparator: '→',
    },
    accessibility: {
      mainNavigation: 'Главная навигация',
      menuTitle: 'Навигационное меню',
      menuDescription: 'Навигация по основным разделам сайта EventForMe',
      openMenu: 'Открыть меню',
      closeMenu: 'Закрыть меню',
      logoAlt: 'EventForMe — медиа о культурных событиях',
      logoMainPageLabel: 'EventForMe — главная страница',
      primarySectionsLabel: 'Основные разделы сайта',
      mainMenuLabel: 'Главное меню',
      searchAndSettingsLabel: 'Поиск и настройки',
      siteSearchLabel: 'Поиск по сайту',
      skipToContent: 'Перейти к основному содержанию',
      skipToNavigation: 'Перейти к навигации',
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
      articles: 'статьи',       // lowercase for templates
      rubrics: 'рубрики',       // lowercase for templates
      authors: 'авторы',        // lowercase for templates
      collection: 'коллекция',  // Generic term
      catalog: 'каталог',       // Alternative to collection
    },
    templates: {
      pageTitle: '{section} — {siteName}',
      collectionTitle: 'Все {section}',        // "Все рубрики"
      itemInCollection: '{item} в {collection}', // "Статья в рубрике"
      itemByAuthor: '{item} автора {author}',   // "Статьи автора Иван"
      emptyCollection: 'В {collection} пока нет {items}',
      totalCount: 'Всего: {count} {countLabel}',
    },
  },

  // ===================================================================
  // SEO - Complete site information
  // ===================================================================
  seo: {
    site: {
      name: 'EventForMe',
      fullName: 'EventForMe — медиа о культурных событиях',
      description: 'Ведущий медиа-проект о культурных событиях, музыке, современных идеях и тайнах мира',
      url: 'https://event4me.eu',
      contactEmail: 'info@event4me.eu',
      socialProfiles: [
        'https://vk.com/eventforme',
        'https://t.me/eventforme',
        'https://instagram.com/eventforme'
      ],
    },
    templates: {
      pageTitle: '{title} — {siteName}',
      metaDescription: '{description} на {siteName}',
      collectionPage: '{collection} — {siteName}', 
      itemPage: '{item} — {siteName}',
      searchPage: 'Поиск: {query} — {siteName}',
    },
    keywords: {
      base: 'культурные события, музыка, современные идеи, медиа',
      rubrics: 'рубрики, темы, категории, разделы',
      articles: 'статьи, публикации, материалы, контент',
      authors: 'авторы, эксперты, журналисты, блогеры',
    },
    regional: {
      language: 'ru',
      region: 'Россия',
      targetMarkets: ['Россия', 'СНГ', 'русскоязычное сообщество'],
    },
  },

  // ===================================================================
  // SEARCH - Simple search labels
  // ===================================================================
  search: {
    placeholder: 'Поиск статей...',
    noResults: 'Результатов не найдено',
    searching: 'Поиск...',
    labels: {
      results: 'Результаты поиска',
    },
  },

  // ===================================================================
  // FILTER & SORTING - Simple filter functionality
  // ===================================================================
  filter: {
    allCategories: 'Все категории',
    category: 'Категория', 
    sortOrder: 'Сортировка',
    reset: 'Сброс',
    newest: 'Сначала новые',
    oldest: 'Сначала старые',
    // Accessibility
    categorySelector: 'Выбор категории',
    sortingControl: 'Управление сортировкой', 
    resetButton: 'Сбросить фильтры',
    filterGroup: 'Группа фильтров',
    dropdownLabel: 'Меню фильтров',
  },

  // ===================================================================
  // FOOTER - Minimal footer content
  // ===================================================================
  footer: {
    copyright: 'Все права защищены',
    about: 'О проекте EventForMe',
  },

  // ===================================================================
  // ACCESSIBILITY - Template-driven accessibility
  // ===================================================================
  accessibility: {
    templates: {
      iconAlt: 'Иконка {item}',
      linkTitle: '{action} {item}',
      pageDescription: '{description} на {siteName}',
    },
    skipToContent: 'Перейти к основному содержанию',
    mainNavigation: 'Главная навигация',
    currentPage: 'Текущая страница',
  },
};

/**
 * Main dictionary getter - returns Russian dictionary
 * This replaces the old getDictionary function
 */
export const getDictionary = async (lang: 'ru' = 'ru'): Promise<Dictionary> => {
  return russianDictionary;
};

export default russianDictionary;