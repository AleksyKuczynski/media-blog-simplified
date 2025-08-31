// src/main/components/SEO/SEOManager.tsx
import { Metadata } from 'next';
import { Dictionary } from '@/main/lib/dictionaries/dictionariesTypes';
import { generateRussianSEOMetadata, RussianSEOStructuredData } from './RussianSEOMetadata';

interface SEOManagerProps {
  dict: Dictionary;
  pageType: 'home' | 'article' | 'rubric' | 'author' | 'search';
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

function getSEOTemplate(dict: Dictionary, pageType: string) {
  const templates = {
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
  
  return templates[pageType] || templates.home;
}