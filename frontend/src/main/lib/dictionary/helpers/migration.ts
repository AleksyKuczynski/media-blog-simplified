// src/main/lib/dictionary/helpers/migration.ts
// Compatibility helpers for migration from old dictionary system

import { Dictionary } from '../types';

// ===================================================================
// LEGACY DICTIONARY COMPATIBILITY
// ===================================================================

/**
 * Legacy dictionary interface for backward compatibility
 * Represents the old dictionary structure during migration
 */
export interface LegacyDictionary {
  [key: string]: any;
  seo?: {
    siteName?: string;
    titles?: Record<string, string>;
    descriptions?: Record<string, string>;
    keywords?: Record<string, string>;
  };
  navigation?: Record<string, any>;
  common?: Record<string, any>;
}

/**
 * Get dictionary section with fallback (for migration compatibility)
 * Safely access nested dictionary properties during transition period
 * 
 * @param dictionary - Dictionary object (old or new format)
 * @param sectionPath - Dot-separated path (e.g., 'seo.titles.home')
 * @param fallback - Fallback value if path doesn't exist
 * @returns Found value or fallback
 */
export const getDictionarySection = (
  dictionary: any, 
  sectionPath: string, 
  fallback: any = null
): any => {
  try {
    const result = sectionPath.split('.').reduce((obj, key) => {
      return obj && typeof obj === 'object' ? obj[key] : undefined;
    }, dictionary);
    
    return result !== undefined ? result : fallback;
  } catch (error) {
    console.warn(`Failed to access dictionary path "${sectionPath}":`, error);
    return fallback;
  }
};

/**
 * Merge old dictionary format with new format during migration
 * Combines dictionaries while preserving data and handling conflicts
 * 
 * @param oldDict - Legacy dictionary format
 * @param newDict - New dictionary format
 * @returns Merged dictionary with preference for new format
 */
export const mergeDictionaryFormats = (
  oldDict: LegacyDictionary, 
  newDict: Partial<Dictionary>
): Dictionary => {
  // Start with old dictionary as base
  const merged = { ...oldDict };
  
  // Carefully merge each section from new dictionary
  Object.entries(newDict).forEach(([section, content]) => {
    if (content && typeof content === 'object') {
      // Deep merge objects
      merged[section] = {
        ...merged[section],
        ...content,
      };
    } else {
      // Direct assignment for primitive values
      merged[section] = content;
    }
  });
  
  // Validate critical sections exist
  ensureCriticalSections(merged);
  
  return merged as Dictionary;
};

/**
 * Convert legacy SEO structure to new format
 * Transforms old SEO configuration to new typed structure
 * 
 * @param legacySEO - Old SEO configuration
 * @returns New SEO format
 */
export const convertLegacySEO = (legacySEO: any): Dictionary['seo'] => {
  const defaultSEO: Dictionary['seo'] = {
    site: {
      name: 'EventForMe',
      fullName: 'EventForMe — медиа-платформа о культуре и событиях',
      description: 'Медиа-платформа о культурных событиях, музыке, искусстве и идеях',
      url: 'https://event4me.eu',
      contactEmail: 'info@event4me.eu',
      socialProfiles: [
        'https://vk.com/eventforme',
        'https://t.me/eventforme',
      ],
      organizationDescription: 'Медиа-платформа о культурных событиях и творчестве',
      geographicAreas: ['Россия', 'СНГ', 'Европа'],
    },
    titles: {
      homePrefix: 'EventForMe',
      homeSuffix: '— медиа о культуре и событиях',
      articleTemplate: '{title} — EventForMe',
      rubricTemplate: '{rubric} — EventForMe',
      authorTemplate: '{author} — EventForMe',
      searchTemplate: 'Поиск: {query} — EventForMe',
      rubricsListTitle: 'Все рубрики — EventForMe',
      rubricsList: 'Рубрики — EventForMe',
    },
    descriptions: {
      home: 'Медиа-платформа о культурных событиях, музыке, искусстве и творческих идеях',
      articleTemplate: '{description}',
      rubricTemplate: 'Статьи в рубрике {rubric} на EventForMe — медиа о культуре и событиях',
      authorTemplate: 'Статьи автора {author} на EventForMe — медиа о культуре и событиях',
      searchTemplate: 'Результаты поиска по запросу "{query}" на EventForMe',
      rubricsList: 'Все рубрики и категории статей на EventForMe — медиа о культуре и событиях',
    },
    keywords: {
      general: 'культура, события, музыка, искусство, творчество, медиа',
      articles: 'статьи, культура, события, творчество',
      rubrics: 'рубрики, категории, темы, культура',
      authors: 'авторы, писатели, журналисты, творческие люди',
      rubricsList: 'рубрики, категории, разделы, темы',
      music: 'музыка, концерты, фестивали, музыканты',
      culture: 'культура, искусство, творчество, выставки',
      events: 'события, мероприятия, фестивали, концерты',
      mystic: 'мистика, эзотерика, духовность, философия',
    },
    regional: {
      language: 'ru',
      region: 'RU',
      geographicCoverage: 'Россия, СНГ',
      targetMarkets: ['Россия', 'Казахстан', 'Беларусь', 'Украина'],
    },
    structuredData: {
      organizationName: 'EventForMe',
      organizationDescription: 'Медиа-платформа о культурных событиях и творчестве',
      contactEmail: 'info@event4me.eu',
      socialProfiles: [
        'https://vk.com/eventforme',
        'https://t.me/eventforme',
      ],
      geographicAreas: ['Россия', 'СНГ', 'Европа'],
      rubricsCollection: {
        name: 'Рубрики EventForMe',
        description: 'Коллекция рубрик и категорий статей о культуре и событиях',
        numberOfItems: 'Количество рубрик',
        itemListElement: 'Элемент списка рубрик',
      },
    },
  };

  if (!legacySEO || typeof legacySEO !== 'object') {
    return defaultSEO;
  }

  // Merge legacy SEO data with defaults
  return {
    site: {
      ...defaultSEO.site,
      name: legacySEO.siteName || defaultSEO.site.name,
      ...legacySEO.site,
    },
    titles: {
      ...defaultSEO.titles,
      ...legacySEO.titles,
    },
    descriptions: {
      ...defaultSEO.descriptions,
      ...legacySEO.descriptions,
    },
    keywords: {
      ...defaultSEO.keywords,
      ...legacySEO.keywords,
    },
    regional: {
      ...defaultSEO.regional,
      ...legacySEO.regional,
    },
    structuredData: {
      ...defaultSEO.structuredData,
      ...legacySEO.structuredData,
    },
  };
};

// ===================================================================
// VALIDATION AND MIGRATION HELPERS
// ===================================================================

/**
 * Ensure critical dictionary sections exist
 * Adds missing sections with defaults during migration
 * 
 * @param dictionary - Dictionary to validate
 * @modifies dictionary in-place
 */
const ensureCriticalSections = (dictionary: any): void => {
  // Ensure navigation section exists
  if (!dictionary.navigation) {
    dictionary.navigation = {
      labels: {
        home: 'Главная',
        articles: 'Статьи', 
        rubrics: 'Рубрики',
        authors: 'Авторы',
        search: 'Поиск',
      },
      descriptions: {
        home: 'Главная страница EventForMe',
        articles: 'Все статьи',
        rubrics: 'Все рубрики',
        authors: 'Наши авторы',
        search: 'Поиск по сайту',
      },
    };
  }

  // Ensure SEO section exists
  if (!dictionary.seo) {
    dictionary.seo = convertLegacySEO({});
  }

  // Ensure common section exists
  if (!dictionary.common) {
    dictionary.common = {
      loading: 'Загрузка...',
      error: 'Произошла ошибка',
      notFound: 'Не найдено',
      tryAgain: 'Попробуйте снова',
    };
  }
};

/**
 * Validate migration completeness
 * Checks that migration from old to new format was successful
 * 
 * @param oldTranslations - Original translations
 * @param newDictionary - Migrated dictionary
 * @returns Migration validation results
 */
export const validateMigration = (
  oldTranslations: LegacyDictionary,
  newDictionary: Dictionary
): { 
  isValid: boolean; 
  errors: string[];
  warnings: string[];
  missingKeys: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const missingKeys: string[] = [];

  // Critical sections that must exist
  const requiredSections = ['navigation', 'seo', 'common', 'search'];
  
  requiredSections.forEach(section => {
    if (!newDictionary[section as keyof Dictionary]) {
      errors.push(`Missing required section: ${section}`);
    }
  });

  // Check for critical SEO fields
  if (newDictionary.seo) {
    const seoFields = ['site', 'titles', 'descriptions', 'keywords'];
    seoFields.forEach(field => {
      if (!newDictionary.seo[field as keyof Dictionary['seo']]) {
        errors.push(`Missing critical SEO field: ${field}`);
      }
    });
  }

  // Compare old keys with new structure (basic check)
  const oldKeys = extractAllKeys(oldTranslations);
  const newKeys = extractAllKeys(newDictionary);
  
  oldKeys.forEach(key => {
    if (!newKeys.includes(key)) {
      missingKeys.push(key);
    }
  });

  if (missingKeys.length > 0 && missingKeys.length > oldKeys.length * 0.1) {
    warnings.push(`${missingKeys.length} keys from old dictionary may be missing`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    missingKeys: missingKeys.slice(0, 10), // Show first 10 for debugging
  };
};

/**
 * Extract all keys from a nested object (for migration validation)
 * Recursively finds all property keys in an object
 * 
 * @param obj - Object to extract keys from
 * @param prefix - Key prefix for nested objects
 * @returns Array of all keys in object
 */
const extractAllKeys = (obj: any, prefix: string = ''): string[] => {
  const keys: string[] = [];
  
  if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      keys.push(fullKey);
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        keys.push(...extractAllKeys(obj[key], fullKey));
      }
    });
  }
  
  return keys;
};

// ===================================================================
// DEBUGGING AND DEVELOPMENT HELPERS
// ===================================================================

/**
 * Log migration progress for debugging
 * Helps track what's being migrated during development
 * 
 * @param step - Migration step description
 * @param data - Data to log (optional)
 */
export const logMigrationStep = (step: string, data?: any): void => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🔄 Migration: ${step}`);
    if (data) {
      console.log(data);
    }
    console.groupEnd();
  }
};

/**
 * Create migration report for documentation
 * Generates detailed report of migration changes
 * 
 * @param oldDict - Original dictionary
 * @param newDict - Migrated dictionary
 * @returns Migration report
 */
export const createMigrationReport = (
  oldDict: LegacyDictionary,
  newDict: Dictionary
): {
  summary: string;
  sectionsAdded: string[];
  sectionsModified: string[];
  keysPreserved: number;
  recommendations: string[];
} => {
  const sectionsAdded: string[] = [];
  const sectionsModified: string[] = [];
  const recommendations: string[] = [];

  // Check for new sections
  Object.keys(newDict).forEach(section => {
    if (!oldDict[section]) {
      sectionsAdded.push(section);
    } else {
      sectionsModified.push(section);
    }
  });

  const oldKeyCount = extractAllKeys(oldDict).length;
  const newKeyCount = extractAllKeys(newDict).length;

  if (sectionsAdded.length > 0) {
    recommendations.push('Test new sections thoroughly for UI compatibility');
  }

  if (newKeyCount < oldKeyCount * 0.9) {
    recommendations.push('Review missing keys - some content may not be available');
  }

  return {
    summary: `Migrated ${sectionsModified.length} sections, added ${sectionsAdded.length} new sections`,
    sectionsAdded,
    sectionsModified,
    keysPreserved: Math.min(oldKeyCount, newKeyCount),
    recommendations,
  };
};