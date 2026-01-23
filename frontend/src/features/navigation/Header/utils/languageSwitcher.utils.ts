// features/navigation/Header/utils/languageSwitcher.utils.ts

import { Lang } from '@/config/i18n';

/**
 * Get alternate language
 */
export function getAlternateLang(currentLang: Lang): Lang {
  return currentLang === 'en' ? 'ru' : 'en';
}

/**
 * Get display label for language
 */
export function getLanguageLabel(currentLang: Lang): string {
  return currentLang === 'en' ? 'РУС' : 'EN';
}

/**
 * Get fallback URL for alternate language
 */
export function getFallbackUrl(currentLang: Lang): string {
  const alternateLang = getAlternateLang(currentLang);
  return `/${alternateLang}`;
}

/**
 * Set language preference cookie
 */
export function setLanguagePreferenceCookie(lang: Lang): void {
  document.cookie = `preferred-language=${lang}; path=/; max-age=31536000; SameSite=Lax`;
}

/**
 * Get ARIA label for language switch
 */
export function getLanguageSwitchAriaLabel(alternateLang: Lang): string {
  return `Switch to ${alternateLang === 'en' ? 'English' : 'Russian'}`;
}