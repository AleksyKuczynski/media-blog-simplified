// frontend/src/main/components/SEO/metadata/SearchMetadata.tsx
import { Metadata } from 'next';
import { Dictionary } from '@/main/lib/dictionary';
import { 
  buildMetadata, 
  createWebsiteSEOData,
} from '../core/MetadataBuilder';
import {
  generateSearchSEOData,
} from '@/main/lib/dictionary/helpers/search';

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
      description: `${dictionary.search.templates.pageDescription} на ${dictionary.seo.site.name}`,
    };
  }
};

export { generateSearchMetadataSimple as generateSearchMetadata };