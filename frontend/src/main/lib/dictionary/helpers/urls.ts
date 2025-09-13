// src/main/lib/dictionary/helpers/urls.ts
// URL generation and path utilities for EventForMe

// ===================================================================
// CANONICAL URL GENERATION
// ===================================================================

/**
 * Base URL for the EventForMe site
 * Centralized configuration for easy maintenance
 */
export const SITE_BASE_URL = 'https://event4me.eu';

/**
 * Generate canonical URL for Russian pages
 * All URLs are prefixed with /ru for the Russian market
 * 
 * @param path - Path relative to the site root
 * @returns Full canonical URL
 * 
 * @example
 * generateCanonicalUrl('/articles/music-events')
 * // Returns: 'https://event4me.eu/ru/articles/music-events'
 */
export const generateCanonicalUrl = (path: string): string => {
  // Ensure path starts with /
  const basePath = path.startsWith('/') ? path : `/${path}`;
  
  // Add Russian language prefix if not already present
  const russianPath = basePath.startsWith('/ru') ? basePath : `/ru${basePath}`;
  
  return `${SITE_BASE_URL}${russianPath}`;
};

/**
 * Alias for generateCanonicalUrl for consistency with existing code
 * Maintains backward compatibility during migration
 */
export const getCanonicalURL = generateCanonicalUrl;

// ===================================================================
// URL VALIDATION
// ===================================================================

/**
 * Validate URL format and accessibility
 * Comprehensive URL validation for SEO purposes
 * 
 * @param url - URL to validate
 * @returns True if URL is valid and accessible
 */
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    
    // Check protocol is HTTP or HTTPS
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // Check hostname exists
    if (!urlObj.hostname || urlObj.hostname.length === 0) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if URL uses HTTPS
 * Important for SEO and security validation
 * 
 * @param url - URL to check
 * @returns True if URL uses HTTPS
 */
export const isHttpsUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Check if URL is an internal EventForMe URL
 * Useful for link validation and internal linking
 * 
 * @param url - URL to check
 * @returns True if URL belongs to EventForMe domain
 */
export const isInternalUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === 'event4me.eu' || urlObj.hostname === 'www.event4me.eu';
  } catch {
    // If not a valid URL, check if it's a relative path
    return url.startsWith('/') && !url.startsWith('//');
  }
};

// ===================================================================
// PATH UTILITIES
// ===================================================================

/**
 * Clean and normalize URL paths
 * Removes double slashes, trailing slashes (except root), and ensures proper format
 * 
 * @param path - Path to clean
 * @returns Normalized path
 */
export const cleanPath = (path: string): string => {
  return path
    .replace(/\/+/g, '/') // Replace multiple slashes with single slash
    .replace(/\/$/, '') // Remove trailing slash
    || '/'; // Ensure root path is just '/'
};

/**
 * Join URL path segments safely
 * Combines multiple path segments without creating double slashes
 * 
 * @param segments - Path segments to join
 * @returns Joined path
 * 
 * @example
 * joinPaths('ru', 'articles', 'music-events')
 * // Returns: '/ru/articles/music-events'
 */
export const joinPaths = (...segments: string[]): string => {
  const cleanSegments = segments
    .map(segment => segment.replace(/^\/+|\/+$/g, '')) // Remove leading/trailing slashes
    .filter(segment => segment.length > 0); // Remove empty segments
    
  return `/${cleanSegments.join('/')}`;
};

/**
 * Extract path segments from URL
 * Splits URL path into individual segments for analysis
 * 
 * @param path - URL path to split
 * @returns Array of path segments
 */
export const getPathSegments = (path: string): string[] => {
  return cleanPath(path)
    .split('/')
    .filter(segment => segment.length > 0);
};

// ===================================================================
// SITE-SPECIFIC URL GENERATION
// ===================================================================

/**
 * Generate article URL
 * Creates properly formatted URL for article pages
 * 
 * @param rubricSlug - Rubric slug (e.g., 'music')
 * @param articleSlug - Article slug (e.g., 'concert-review')
 * @returns Full article URL
 */
export const generateArticleUrl = (rubricSlug: string, articleSlug: string): string => {
  return generateCanonicalUrl(`/${rubricSlug}/${articleSlug}`);
};

/**
 * Generate rubric URL
 * Creates properly formatted URL for rubric pages
 * 
 * @param rubricSlug - Rubric slug
 * @returns Full rubric URL
 */
export const generateRubricUrl = (rubricSlug: string): string => {
  return generateCanonicalUrl(`/${rubricSlug}`);
};

/**
 * Generate author URL
 * Creates properly formatted URL for author pages
 * 
 * @param authorSlug - Author slug
 * @returns Full author URL
 */
export const generateAuthorUrl = (authorSlug: string): string => {
  return generateCanonicalUrl(`/authors/${authorSlug}`);
};

/**
 * Generate search URL
 * Creates properly formatted URL for search results
 * 
 * @param query - Search query
 * @param filters - Optional search filters
 * @returns Full search URL
 */
export const generateSearchUrl = (
  query: string, 
  filters: { rubric?: string; author?: string; sort?: string } = {}
): string => {
  const params = new URLSearchParams();
  
  if (query.trim()) {
    params.set('q', query.trim());
  }
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });
  
  const queryString = params.toString();
  const searchPath = queryString ? `/search?${queryString}` : '/search';
  
  return generateCanonicalUrl(searchPath);
};

// ===================================================================
// SOCIAL MEDIA URL GENERATION
// ===================================================================

/**
 * Generate sharing URLs for different platforms
 * Creates properly formatted URLs for social media sharing
 */
export const generateSharingUrls = (
  url: string, 
  title: string, 
  description?: string
) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = description ? encodeURIComponent(description) : '';
  
  return {
    // VK (popular in Russia)
    vkontakte: `https://vk.com/share.php?url=${encodedUrl}&title=${encodedTitle}&description=${encodedDescription}`,
    
    // Telegram (popular in Russia)
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    
    // Odnoklassniki (popular in Russia)  
    odnoklassniki: `https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=${encodedUrl}&st.title=${encodedTitle}`,
    
    // Facebook (international)
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    
    // Twitter/X (international)
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    
    // WhatsApp
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };
};

// ===================================================================
// URL ANALYSIS UTILITIES
// ===================================================================

/**
 * Analyze URL for SEO factors
 * Checks URL structure for SEO best practices
 * 
 * @param url - URL to analyze
 * @returns SEO analysis results
 */
export const analyzeSEOUrl = (url: string): {
  score: number;
  issues: string[];
  recommendations: string[];
} => {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;
  
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const segments = getPathSegments(path);
    
    // Check HTTPS
    if (urlObj.protocol !== 'https:') {
      issues.push('URL should use HTTPS for security and SEO');
      score -= 20;
    }
    
    // Check URL length
    if (url.length > 100) {
      issues.push('URL is longer than recommended 100 characters');
      score -= 10;
    }
    
    // Check for readable slugs
    if (segments.some(segment => /[А-Яа-я]/.test(segment))) {
      issues.push('URL contains Cyrillic characters - use transliteration for better compatibility');
      score -= 15;
    }
    
    // Check depth
    if (segments.length > 4) {
      recommendations.push('Consider shorter URL structure (fewer nested levels)');
    }
    
    // Check for stop words
    const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const hasStopWords = segments.some(segment => 
      stopWords.some(stopWord => segment.toLowerCase().includes(stopWord))
    );
    
    if (hasStopWords) {
      recommendations.push('Consider removing stop words from URL for brevity');
    }
    
  } catch (error) {
    issues.push('Invalid URL format');
    score = 0;
  }
  
  return {
    score: Math.max(0, score),
    issues,
    recommendations,
  };
};