// src/main/components/SEO/metadata/SearchMetadata.tsx
// STATIC ONLY: Removed query handling, simplified for three page states

import { Metadata } from 'next';
import { Dictionary } from '@/main/lib/dictionary/types';
import { 
  buildMetadata, 
  createWebsiteSEOData,
} from '../core/MetadataBuilder';
import {
  generateSearchSEOData,
} from '@/main/lib/dictionary/helpers/search';

// ===================================================================
// STATIC SEARCH METADATA ONLY - NO QUERY HANDLING
// ===================================================================

/**
 * Generate static search page metadata 
 * REMOVED: query, resultCount, dynamic metadata
 * FOCUS: Static SEO for all three page states
 */
export const generateSearchMetadataSimple = (dictionary: Dictionary): Metadata => {
  try {
    // Use existing search helper - STATIC ONLY
    const searchSEOData = generateSearchSEOData(dictionary);
    
    // Create basic SEO data using existing function
    const seoData = createWebsiteSEOData(
      searchSEOData.title,
      searchSEOData.description,
      searchSEOData.keywords,
      searchSEOData.canonicalUrl,
      `${dictionary.seo.site.url}/og-search.jpg`
    );

    // Use existing MetadataBuilder with basic context
    const metadata = buildMetadata(seoData);

    return metadata;
    
  } catch (error) {
    console.error('SearchMetadata: Error generating metadata', error);
    
    // Fallback metadata using dictionary only
    return {
      title: `${dictionary.search.templates.pageTitle} — ${dictionary.seo.site.name}`,
      description: `${dictionary.search.templates.pageDescription} на ${dictionary.seo.site.name}`,
    };
  }
};

export { generateSearchMetadataSimple as generateSearchMetadata };