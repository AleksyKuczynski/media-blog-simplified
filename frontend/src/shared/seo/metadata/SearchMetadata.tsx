// frontend/src/shared/seo/metadata/SearchMetadata.tsx
import { Metadata } from 'next';
import { Dictionary } from '@/config/i18n';
import { processTemplate } from '@/config/i18n/helpers/templates';
import { 
  buildMetadata, 
  createWebsiteSEOData,
} from '../core/MetadataBuilder';
import {
  generateSearchSEOData,
} from '@/config/i18n/helpers/search';

export const generateSearchMetadataSimple = (dictionary: Dictionary): Metadata => {
  try {
    const searchSEOData = generateSearchSEOData(dictionary);
    
    const seoData = createWebsiteSEOData(
      searchSEOData.title,
      searchSEOData.description,
      searchSEOData.keywords,
      searchSEOData.canonicalUrl,
      dictionary.locale,
      `${dictionary.seo.site.url}/og-default.jpg`
    );

    const metadata = buildMetadata(seoData);

    return {
      ...metadata,
      robots: { index: false, follow: false },
    };
    
  } catch (error) {
    console.error('SearchMetadata: Error generating metadata', error);
    
    return {
      title: `${dictionary.search.templates.pageTitle} — ${dictionary.seo.site.name}`,
      description: processTemplate(dictionary.seo.templates.metaDescription, {
        description: dictionary.search.templates.pageDescription,
        siteName: dictionary.seo.site.name,
      }),
      robots: { index: false, follow: false },
    };
  }
};

export { generateSearchMetadataSimple as generateSearchMetadata };