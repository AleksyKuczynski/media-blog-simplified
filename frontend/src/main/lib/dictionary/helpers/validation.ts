// src/main/lib/dictionary/helpers/validation.ts
// Simple validation utilities - no complex dependencies

/**
 * Check if text contains Russian (Cyrillic) characters
 */
export const hasRussianText = (text: string): boolean => {
  return /[а-яё]/i.test(text);
};

/**
 * Validate URL format
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
 * Check if URL uses HTTPS
 */
export const isHttpsUrl = (url: string): boolean => {
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validate template has been properly processed (no remaining placeholders)
 */
export const validateTemplate = (processed: string): boolean => {
  return !processed.includes('{') && !processed.includes('}');
};

/**
 * Basic text length validation
 */
export const validateTextLength = (text: string, min: number = 1, max: number = 1000): {
  isValid: boolean;
  warnings: string[];
} => {
  const warnings: string[] = [];
  
  if (text.length < min) {
    warnings.push(`Text is too short (${text.length} chars, minimum ${min})`);
  }
  
  if (text.length > max) {
    warnings.push(`Text is too long (${text.length} chars, maximum ${max})`);
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
  };
};

/**
 * Validate template variables are properly defined
 */
export const validateTemplateVariables = (
  template: string, 
  variables: Record<string, any>
): {
  isValid: boolean;
  missing: string[];
  unused: string[];
} => {
  // Extract required variables from template
  const requiredVars = Array.from(template.matchAll(/\{([^}]+)\}/g))
    .map(match => match[1])
    .filter((value, index, array) => array.indexOf(value) === index); // unique
  
  // Check for missing variables
  const missing = requiredVars.filter(varName => 
    variables[varName] === undefined || variables[varName] === null
  );
  
  // Check for unused variables
  const providedVars = Object.keys(variables);
  const unused = providedVars.filter(varName => !requiredVars.includes(varName));
  
  return {
    isValid: missing.length === 0,
    missing,
    unused,
  };
};

/**
 * Validate Russian language content
 */
export const validateRussianContent = (text: string): {
  isValid: boolean;
  warnings: string[];
} => {
  const warnings: string[] = [];
  
  if (!hasRussianText(text)) {
    warnings.push('Text should contain Russian (Cyrillic) characters');
  }
  
  // Check for common issues
  if (text.includes('undefined') || text.includes('null')) {
    warnings.push('Text contains placeholder values');
  }
  
  if (text.includes('{') || text.includes('}')) {
    warnings.push('Text contains unprocessed template variables');
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
  };
};

/**
 * Extract Russian words from mixed-language text
 */
export const extractRussianWords = (text: string): string[] => {
  const russianWordPattern = /\b\w*[а-яё]\w*\b/gi;
  return text.match(russianWordPattern) || [];
};

/**
 * Simple keyword density check
 */
export const checkKeywordDensity = (text: string, keyword: string): {
  density: number;
  occurrences: number;
  isOptimal: boolean;
} => {
  const words = text.toLowerCase().split(/\s+/);
  const keywordLower = keyword.toLowerCase();
  const occurrences = words.filter(word => word.includes(keywordLower)).length;
  const density = (occurrences / words.length) * 100;
  
  // Optimal keyword density is typically 1-3%
  const isOptimal = density >= 1 && density <= 3;
  
  return {
    density: Math.round(density * 100) / 100, // Round to 2 decimal places
    occurrences,
    isOptimal,
  };
};

/**
 * Check for duplicate content patterns
 */
export const checkForDuplication = (texts: string[]): {
  hasDuplicates: boolean;
  duplicates: string[];
} => {
  const seen = new Set<string>();
  const duplicates: string[] = [];
  
  texts.forEach(text => {
    const normalized = text.toLowerCase().trim();
    if (seen.has(normalized)) {
      duplicates.push(text);
    } else {
      seen.add(normalized);
    }
  });
  
  return {
    hasDuplicates: duplicates.length > 0,
    duplicates,
  };
};

// Fix default export - assign to variable first
const validationHelpers = {
  hasRussianText,
  isValidUrl,
  isHttpsUrl,
  validateTemplate,
  validateTextLength,
  validateTemplateVariables,
  validateRussianContent,
  extractRussianWords,
  checkKeywordDensity,
  checkForDuplication,
};

export default validationHelpers;