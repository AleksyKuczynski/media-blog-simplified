// src/main/components/SEO/SEOManager.tsx - Fixed TypeScript Issues
import { Metadata } from 'next';
import { Dictionary } from '@/main/lib/dictionaries/dictionariesTypes';
import { generateRussianSEOMetadata } from './RussianSEOMetadata';

// ✅ FIXED: Proper type definition for page types
type PageType = 'home' | 'article' | 'rubric' | 'author' | 'search';

interface SEOManagerProps {
  dict: Dictionary;
  pageType: PageType;
  pageData?: {
    title?: string;
    description?: string;
    keywords?: string;
    path?: string;
    imageUrl?: string;
    articleData?: {
      publishedTime?: string;
      modifiedTime?: string;
      author?: string;
      section?: string;
      tags?: string[];
    };
    breadcrumbs?: Array<{
      name: string;
      url: string;
    }>;
  };
}

// ✅ FIXED: Proper interface for SEO templates
interface SEOTemplate {
  title: string;
  description: string;
  keywords: string;
}

// ✅ FIXED: Proper type for templates object
type SEOTemplates = Record<PageType, SEOTemplate>;

export function generateSEOMetadata({ dict, pageType, pageData = {} }: SEOManagerProps): Metadata {
  const seoTemplate = getSEOTemplate(dict, pageType);
  
  const finalTitle = pageData.title || seoTemplate.title;
  const finalDescription = pageData.description || seoTemplate.description;
  const finalKeywords = pageData.keywords || seoTemplate.keywords;
  
  return generateRussianSEOMetadata({
    dict,
    title: finalTitle,
    description: finalDescription,
    keywords: finalKeywords,
    path: pageData.path,
    imageUrl: pageData.imageUrl,
    articleData: pageData.articleData
  });
}

// ✅ FIXED: Proper type guard and fallback handling
function getSEOTemplate(dict: Dictionary, pageType: PageType): SEOTemplate {
  const templates: SEOTemplates = {
    home: {
      title: dict.seo.titles.homePrefix,
      description: dict.seo.descriptions.home,
      keywords: dict.seo.keywords.general
    },
    article: {
      title: dict.seo.titles.articleTemplate || '{title} - {siteName}',
      description: dict.seo.descriptions.articleTemplate || 'Читать статью "{title}" на EventForMe',
      keywords: dict.seo.keywords.articles || dict.seo.keywords.general
    },
    rubric: {
      title: dict.seo.titles.rubricTemplate || '{rubric} - {siteName}',
      description: dict.seo.descriptions.rubricTemplate || 'Статьи в рубрике {rubric} на EventForMe',
      keywords: dict.seo.keywords.rubrics || dict.seo.keywords.general
    },
    author: {
      title: dict.seo.titles.authorTemplate || '{author} - {siteName}',
      description: dict.seo.descriptions.authorTemplate || 'Статьи автора {author} на EventForMe',
      keywords: dict.seo.keywords.authors || dict.seo.keywords.general
    },
    search: {
      title: dict.seo.titles.searchTemplate || 'Поиск - {siteName}',
      description: dict.seo.descriptions.searchTemplate || 'Поиск статей на EventForMe',
      keywords: dict.seo.keywords.general
    }
  };
  
  // ✅ FIXED: Type-safe access with proper fallback
  return templates[pageType] || templates.home;
}

// ✅ NEW: Type guard helper function (optional, for additional safety)
export function isValidPageType(pageType: string): pageType is PageType {
  return ['home', 'article', 'rubric', 'author', 'search'].includes(pageType);
}

// ✅ NEW: Safe wrapper function for external usage (optional)
export function generateSEOMetadataSafe({ 
  dict, 
  pageType, 
  pageData = {} 
}: {
  dict: Dictionary;
  pageType: string;
  pageData?: SEOManagerProps['pageData'];
}): Metadata {
  const safePageType: PageType = isValidPageType(pageType) ? pageType : 'home';
  return generateSEOMetadata({ dict, pageType: safePageType, pageData });
}