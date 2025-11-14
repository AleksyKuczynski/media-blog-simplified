// src/main/lib/dictionary/helpers/validation.ts

/**
 * Check if URL is valid
 * KEEP: Used for basic URL validation
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate URL format for specific protocols
 * KEEP: Used for HTTP/HTTPS validation
 */
export const isValidHttpUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Check if text contains Russian characters
 * KEEP: Used for Russian content validation
 */
export const hasRussianText = (text: string): boolean => {
  return /[а-яё]/i.test(text);
};

/**
 * Check if text is not empty and meaningful
 * KEEP: Basic text validation
 */
export const isValidText = (text: string): boolean => {
  return typeof text === 'string' && text.trim().length > 0;
};

/**
 * Validate text length for SEO purposes
 * KEEP: Used for SEO content validation
 */
export const validateTextLength = (
  text: string,
  type: 'title' | 'description' | 'keywords'
): { isValid: boolean; message?: string } => {
  const limits = {
    title: { min: 10, max: 60 },
    description: { min: 50, max: 160 },
    keywords: { min: 10, max: 200 },
  };
  
  const { min, max } = limits[type];
  const length = text.length;
  
  if (length < min) {
    return {
      isValid: false,
      message: `${type} too short: ${length} chars (minimum: ${min})`,
    };
  }
  
  if (length > max) {
    return {
      isValid: false,
      message: `${type} too long: ${length} chars (maximum: ${max})`,
    };
  }
  
  return { isValid: true };
};

/**
 * Validate content for SEO requirements
 * ESSENTIAL: Used by RubricMetadata and other SEO components
 */
export const validateSEOContent = (content: {
  title: string;
  description: string;
  keywords?: string;
}): { isValid: boolean; warnings: string[] } => {
  const warnings: string[] = [];
  
  // Validate title
  const titleValidation = validateTextLength(content.title, 'title');
  if (!titleValidation.isValid) {
    warnings.push(titleValidation.message!);
  }
  
  // Validate description
  const descriptionValidation = validateTextLength(content.description, 'description');
  if (!descriptionValidation.isValid) {
    warnings.push(descriptionValidation.message!);
  }
  
  // Check for Russian content
  const hasRussian = hasRussianText(content.title + content.description);
  if (!hasRussian) {
    warnings.push('No Russian text detected in title or description');
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
  };
};