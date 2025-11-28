// src/main/components/Navigation/Breadcrumbs/types.ts

export interface BreadcrumbContext {
  type: 'rubric' | 'author' | 'category' | 'featured' | 'search' | 'external' | 'direct' | 'articles' | 'language-switch';
  referrerPath?: string;
  contextData?: {
    authorName?: string;
    authorSlug?: string;
    categoryName?: string;
    categorySlug?: string;
    searchQuery?: string;
    rubricName?: string;
    rubricSlug?: string;
    previousLang?: string;
  };
}

export interface SmartBreadcrumbItem {
  label: string;
  href: string;
  context?: string;
  ariaLabel?: string;
}

export interface MultipleBreadcrumbPaths {
  canonical: SmartBreadcrumbItem[];
  contextual?: SmartBreadcrumbItem[];
  alternative?: SmartBreadcrumbItem[];
}