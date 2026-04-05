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
      `${dictionary.seo.site.url}/og-search.jpg`
    );

    const metadata = buildMetadata(seoData);

    return metadata;
    
  } catch (error) {
    console.error('SearchMetadata: Error generating metadata', error);
    
    return {
      title: `${dictionary.search.templates.pageTitle} — ${dictionary.seo.site.name}`,
      description: processTemplate(dictionary.seo.templates.metaDescription, {
        description: dictionary.search.templates.pageDescription,
        siteName: dictionary.seo.site.name,
      }),
    };
  }
};

export { generateSearchMetadataSimple as generateSearchMetadata };