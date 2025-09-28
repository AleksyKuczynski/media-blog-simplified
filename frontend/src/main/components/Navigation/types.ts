export interface BreadcrumbContext {
  type: 'rubric' | 'author' | 'category' | 'featured' | 'search' | 'external' | 'direct';
  referrerPath?: string;
  contextData?: {
    authorName?: string;
    authorSlug?: string;
    categoryName?: string;
    categorySlug?: string;
    searchQuery?: string;
    rubricName?: string;
    rubricSlug?: string;
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