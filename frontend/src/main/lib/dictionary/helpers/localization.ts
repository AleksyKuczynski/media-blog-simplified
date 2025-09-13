// src/main/lib/dictionary/helpers/localization.ts
// Russian language and pluralization utilities

// ===================================================================
// RUSSIAN PLURALIZATION
// ===================================================================

/**
 * Russian pluralization rules interface
 * Defines the three forms needed for proper Russian grammar
 */
export interface RussianPlurals {
  readonly one: string;   // 1 статья (1, 21, 31, ...)
  readonly few: string;   // 2-4 статьи (2, 3, 4, 22, 23, 24, ...)
  readonly many: string;  // 5+ статей (0, 5-20, 25-30, ...)
}

/**
 * Get article count with proper Russian pluralization
 * Implements complex Russian pluralization rules correctly
 * 
 * @param count - Number of articles
 * @param articlePlurals - Plural forms from dictionary
 * @returns Properly formatted count string
 * 
 * @example
 * getLocalizedArticleCount(1, { one: 'статья', few: 'статьи', many: 'статей' })
 * // Returns: '1 статья'
 * 
 * getLocalizedArticleCount(23, { one: 'статья', few: 'статьи', many: 'статей' })
 * // Returns: '23 статьи'
 */
export const getLocalizedArticleCount = (
  count: number, 
  articlePlurals: RussianPlurals
): string => {
  // Russian pluralization rules:
  // - Numbers ending in 1 (but not 11): use "one" form
  // - Numbers ending in 2-4 (but not 12-14): use "few" form  
  // - All other numbers: use "many" form
  
  if (count % 10 === 1 && count % 100 !== 11) {
    return `${count} ${articlePlurals.one}`;
  } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return `${count} ${articlePlurals.few}`;
  } else {
    return `${count} ${articlePlurals.many}`;
  }
};

/**
 * Generic Russian pluralization function
 * Can be used for any Russian nouns with proper plural forms
 * 
 * @param count - Number to pluralize
 * @param plurals - Three plural forms
 * @returns Formatted count with correct plural
 */
export const pluralizeRussian = (count: number, plurals: RussianPlurals): string => {
  return getLocalizedArticleCount(count, plurals);
};

// ===================================================================
// CONTENT LOCALIZATION
// ===================================================================

/**
 * Generate accessibility label for rubric icons
 * Creates screen-reader friendly descriptions using dictionary templates
 * 
 * @param rubricName - Name of the rubric
 * @param iconDescriptionTemplate - Template from dictionary
 * @returns Formatted accessibility label
 */
export const getRubricIconAlt = (
  rubricName: string, 
  iconDescriptionTemplate: string
): string => {
  return `${iconDescriptionTemplate} ${rubricName}`;
};

/**
 * Generate detailed accessibility description for rubric icons
 * More verbose description for complex UI elements
 * 
 * @param rubricName - Name of the rubric
 * @param template - Template with {rubricName} placeholder
 * @returns Formatted accessibility description
 */
export const getRubricIconDescription = (
  rubricName: string, 
  template: string
): string => {
  return template.replace('{rubricName}', rubricName);
};

/**
 * Truncate description with language-aware word boundaries
 * Handles Russian text properly, considering Cyrillic characters
 * 
 * @param description - Text to truncate
 * @param maxLength - Maximum character length
 * @returns Truncated text with ellipsis if needed
 */
export const truncateDescription = (
  description: string, 
  maxLength: number = 120
): string => {
  if (description.length <= maxLength) return description;
  
  const truncated = description.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
};

// ===================================================================
// RUSSIAN TEXT PROCESSING
// ===================================================================

/**
 * Check if text contains Cyrillic characters
 * Useful for validating Russian content
 * 
 * @param text - Text to check
 * @returns True if text contains Cyrillic characters
 */
export const hasRussianText = (text: string): boolean => {
  return /[а-яё]/i.test(text);
};

/**
 * Extract Russian words from mixed language text
 * Separates Russian words from Latin text
 * 
 * @param text - Mixed language text
 * @returns Array of Russian words
 */
export const extractRussianWords = (text: string): string[] => {
  // Match words that contain at least one Cyrillic character
  const russianWordPattern = /\b\w*[а-яё]\w*\b/gi;
  return text.match(russianWordPattern) || [];
};

/**
 * Calculate reading time for Russian text
 * Adjusted for average Russian reading speed (180 WPM)
 * 
 * @param text - Text to analyze
 * @returns Reading time in minutes
 */
export const calculateRussianReadingTime = (text: string): number => {
  const words = text.trim().split(/\s+/).length;
  const russianReadingSpeed = 180; // words per minute
  const minutes = Math.ceil(words / russianReadingSpeed);
  return Math.max(1, minutes); // Minimum 1 minute
};

/**
 * Format reading time in Russian
 * Returns properly localized reading time string
 * 
 * @param minutes - Reading time in minutes
 * @returns Formatted Russian string
 */
export const formatRussianReadingTime = (minutes: number): string => {
  const minutePlurals: RussianPlurals = {
    one: 'минута',
    few: 'минуты', 
    many: 'минут'
  };
  
  return pluralizeRussian(minutes, minutePlurals);
};

// ===================================================================
// DATE AND TIME LOCALIZATION
// ===================================================================

/**
 * Format date in Russian locale
 * Provides properly formatted dates for Russian audience
 * 
 * @param date - Date to format
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string in Russian
 */
export const formatRussianDate = (
  date: Date | string, 
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  }
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('ru-RU', options);
};

/**
 * Get relative time in Russian
 * Returns "2 дня назад", "неделю назад", etc.
 * 
 * @param date - Date to compare with now
 * @returns Relative time string in Russian
 */
export const getRelativeTimeRussian = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'только что';
  } else if (diffInHours < 24) {
    const hourPlurals: RussianPlurals = { one: 'час', few: 'часа', many: 'часов' };
    return `${pluralizeRussian(diffInHours, hourPlurals)} назад`;
  } else if (diffInHours < 24 * 7) {
    const days = Math.floor(diffInHours / 24);
    const dayPlurals: RussianPlurals = { one: 'день', few: 'дня', many: 'дней' };
    return `${pluralizeRussian(days, dayPlurals)} назад`;
  } else if (diffInHours < 24 * 30) {
    const weeks = Math.floor(diffInHours / (24 * 7));
    const weekPlurals: RussianPlurals = { one: 'неделя', few: 'недели', many: 'недель' };
    return `${pluralizeRussian(weeks, weekPlurals)} назад`;
  } else if (diffInHours < 24 * 365) {
    const months = Math.floor(diffInHours / (24 * 30));
    const monthPlurals: RussianPlurals = { one: 'месяц', few: 'месяца', many: 'месяцев' };
    return `${pluralizeRussian(months, monthPlurals)} назад`;
  } else {
    const years = Math.floor(diffInHours / (24 * 365));
    const yearPlurals: RussianPlurals = { one: 'год', few: 'года', many: 'лет' };
    return `${pluralizeRussian(years, yearPlurals)} назад`;
  }
};

// ===================================================================
// CONTENT GENERATION HELPERS
// ===================================================================

/**
 * Generate Russian SEO-friendly URL slug
 * Converts Russian text to URL-safe format
 * 
 * @param text - Russian text to convert
 * @returns URL-safe slug
 */
export const generateRussianSlug = (text: string): string => {
  // Simple transliteration map for common Russian characters
  const transliterationMap: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };
  
  return text
    .toLowerCase()
    .replace(/[а-яё]/g, char => transliterationMap[char] || char)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};