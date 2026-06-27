// frontend/src/shared/seo/metadata/NavigationMetadata.tsx
import { Metadata } from 'next';
import { Dictionary } from '@/config/i18n';
import { processTemplate } from '@/config/i18n/helpers/templates';
import { 
  buildMetadata, 
  createWebsiteSEOData 
} from '../core/MetadataBuilder';

export interface NavigationMetadataProps {
  dictionary: Dictionary;
  currentPath?: string;
}

export const generateNavigationMetadata = async ({
  dictionary,
  currentPath = '/',
}: NavigationMetadataProps): Promise<Metadata> => {
  const title = processTemplate(dictionary.seo.templates.pageTitle, {
    siteName: dictionary.seo.site.name,
  });

  const description = dictionary.seo.site.description;

  const keywords = [
    dictionary.seo.keywords.base,
  ].filter(Boolean).join(', ');

  const canonicalUrl = `${dictionary.seo.site.url}${currentPath}`;

  const websiteSEOData = createWebsiteSEOData(
    title,
    description,
    keywords,
    canonicalUrl,
    dictionary.locale,
    `${dictionary.seo.site.url}/og-default.jpg`
  );

  return buildMetadata(websiteSEOData);
};

export const generateMainNavigationMetadata = async (
  dictionary: Dictionary,
  currentPath: string = '/'
): Promise<Metadata> => {
  return generateNavigationMetadata({
    dictionary,
    currentPath,
  });
};

export const getNavigationOpenGraphData = (
  dictionary: Dictionary,
  title: string,
  description: string,
  canonicalUrl: string
) => {
  return {
    title,
    description,
    url: canonicalUrl,
    siteName: dictionary.seo.site.name,
    locale: dictionary.locale,
    type: 'website' as const,
    
    images: [
      {
        url: `${dictionary.seo.site.url}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: dictionary.seo.site.name,
      },
    ],
  };
};

export const generateBreadcrumbMetadata = (
  dictionary: Dictionary,
  breadcrumbs: Array<{ name: string; href: string }>
): Record<string, string> => {
  if (breadcrumbs.length === 0) return {};

  const breadcrumbText = breadcrumbs.map(b => b.name).join(' > ');

  return {
    'breadcrumb:navigation': breadcrumbText,
    'breadcrumb:count': breadcrumbs.length.toString(),
    'DC.relation': breadcrumbs[breadcrumbs.length - 1]?.name || '',
  };
};

export const getNavigationLinkSEO = (
  dictionary: Dictionary,
  linkText: string,
  href: string
) => {
  return {
    title: `${linkText} — ${dictionary.seo.site.name}`,
    'aria-label': linkText,
    href,
    'data-navigation-link': linkText.toLowerCase(),
  };
};

export const validateNavigationMetadata = (
  metadata: Metadata
): { 
  isValid: boolean; 
  errors: string[] 
} => {
  const errors: string[] = [];

  if (!metadata.title) errors.push('Navigation title is required');
  if (!metadata.description) errors.push('Navigation description is required');
  if (!metadata.alternates?.canonical) errors.push('Canonical URL is required');

  if (metadata.title && typeof metadata.title === 'string' && metadata.title.length > 60) {
    errors.push('Navigation title too long (>60 chars)');
  }

  if (metadata.description && metadata.description.length > 160) {
    errors.push('Navigation description too long (>160 chars)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const getNavigationMetaTags = (
  dictionary: Dictionary
) => {
  const langCode = dictionary.locale.split('_')[0];
  
  return [
    { name: 'DC.type', content: 'Text.Navigation' },
    { name: 'DC.language', content: langCode },
  ];
};