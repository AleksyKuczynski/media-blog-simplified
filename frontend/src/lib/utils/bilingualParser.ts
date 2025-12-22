// frontend/src/lib/utils/bilingualParser.ts

/**
 * Parse bilingual field with separator
 * Format: "English text ||| Русский текст"
 */
export function parseBilingualField(
  value: string | null | undefined,
  lang: 'en' | 'ru'
): string {
  if (!value) return '';
  
  const separator = '|||';
  const parts = value.split(separator).map(s => s.trim());
  
  if (parts.length === 1) {
    // No separator found, return as-is (fallback)
    return parts[0];
  }
  
  // Return English (index 0) or Russian (index 1)
  const index = lang === 'en' ? 0 : 1;
  return parts[index] || parts[0]; // Fallback to English if Russian missing
}

/**
 * Image metadata for SEO
 */
export interface ImageMetadata {
  altText: string;
  caption: string;
  photographer: string;
}

/**
 * Parse directus_files fields for bilingual alt text and caption
 * 
 * @example
 * // In Directus: title = "Concert hall ||| Концертный зал"
 * const metadata = parseImageMetadata({ title: "Concert hall ||| Концертный зал" }, 'ru');
 * // Returns: { altText: "Концертный зал", caption: "", photographer: "" }
 */
export function parseImageMetadata(
  imageData: {
    title?: string;
    description?: string;
    tags?: string[];
  } | null | undefined,
  lang: 'en' | 'ru'
): ImageMetadata {
  if (!imageData) {
    return {
      altText: '',
      caption: '',
      photographer: '',
    };
  }

  return {
    altText: parseBilingualField(imageData.title, lang),
    caption: parseBilingualField(imageData.description, lang),
    photographer: imageData.tags?.[0] || '',
  };
}