// Enhanced SEOManager.tsx with rubrics-collection support
// This extends your existing SEOManager to handle collection pages

import { Metadata } from 'next';
import { Dictionary } from '@/main/lib/dictionaries/dictionariesTypes';

// ✅ ENHANCED: Extended page types to include collection pages
type PageType = 'home' | 'article' | 'rubric' | 'author' | 'search' | 'rubrics-collection';

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
    // ✅ NEW: Collection-specific data
    totalItems?: number;
    collectionType?: string;
  };
}

interface SEOTemplate {
  title: string;
  description: string;
  keywords: string;
}

type SEOTemplates = Record<PageType, SEOTemplate>;

// ✅ ENHANCED: Main SEO metadata generation function
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
    articleData: pageData.articleData,
    pageType: pageType
  });
}

// ✅ ENHANCED: Template selection with collection page support
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
    },
    // ✅ NEW: Collection page template
    'rubrics-collection': {
      title: dict.seo.titles.rubricsListTitle || 'Все рубрики - EventForMe',
      description: dict.seo.descriptions.rubricsList || 'Полный каталог тематических рубрик EventForMe',
      keywords: dict.seo.keywords.rubricsList || dict.seo.keywords.general
    }
  };
  
  return templates[pageType] || templates.home;
}

// ✅ ENHANCED: Core Russian SEO metadata generation
interface GenerateRussianSEOProps {
  dict: Dictionary;
  title: string;
  description: string;
  keywords: string;
  path?: string;
  imageUrl?: string;
  articleData?: any;
  pageType?: PageType;
}

function generateRussianSEOMetadata({
  dict,
  title,
  description,
  keywords,
  path = '',
  imageUrl,
  articleData,
  pageType
}: GenerateRussianSEOProps): Metadata {
  const canonicalUrl = `https://event4me.eu/ru${path}`;
  const defaultImageUrl = imageUrl || 'https://event4me.eu/og-default.jpg';
  
  // ✅ NEW: Collection-specific Open Graph type
  const ogType = pageType === 'rubrics-collection' ? 'website' : 
                 pageType === 'article' ? 'article' : 'website';

  const metadata: Metadata = {
    title,
    description,
    keywords,
    
    // Core SEO
    alternates: {
      canonical: canonicalUrl,
    },
    
    // Open Graph optimization for social sharing
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: dict.seo.siteName,
      locale: 'ru_RU',
      type: ogType,
      images: [
        {
          url: defaultImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    
    // Twitter Card optimization  
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [defaultImageUrl],
    },

    // ✅ ENHANCED: Russian market optimization
    other: {
      'yandex-verification': process.env.YANDEX_VERIFICATION || '',
      'google-site-verification': process.env.GOOGLE_VERIFICATION || '',
      // Language and region
      'content-language': 'ru',
      'geo.region': 'RU',
      'geo.placename': 'Russia',
      // SEO directives
      'robots': 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
      'googlebot': 'index, follow',
      // Dublin Core for better semantic understanding
      'DC.title': title,
      'DC.description': description,
      'DC.language': 'ru',
      'DC.creator': dict.seo.siteName,
      'DC.publisher': dict.seo.siteName,
      'DC.identifier': canonicalUrl,
      'DC.coverage': 'Russia',
      'DC.rights': 'Copyright EventForMe',
    },
  };

  // ✅ ENHANCED: Article-specific metadata
  if (articleData && pageType === 'article') {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime: articleData.publishedTime,
      modifiedTime: articleData.modifiedTime,
      section: articleData.section,
      tags: articleData.tags,
    };
    
    // Add article-specific meta tags
    metadata.other = {
      ...metadata.other,
      'article:author': articleData.author,
      'article:section': articleData.section,
      'article:published_time': articleData.publishedTime,
      'article:modified_time': articleData.modifiedTime,
    };
  }

  // ✅ NEW: Collection-specific metadata
  if (pageType === 'rubrics-collection') {
    metadata.other = {
      ...metadata.other,
      'DC.type': 'Text.Collection',
      'collection:type': 'rubrics',
      'collection:language': 'ru',
    };
  }

  return metadata;
}

// ✅ ENHANCED: Type safety helpers
export function isValidPageType(pageType: string): pageType is PageType {
  return ['home', 'article', 'rubric', 'author', 'search', 'rubrics-collection'].includes(pageType);
}

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