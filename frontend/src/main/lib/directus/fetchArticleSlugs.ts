// frontend/src/main/lib/directus/fetchArticleSlugs.ts
// FINAL: Uses Directus deep filter to fetch only requested language translation

import { DIRECTUS_URL, ITEMS_PER_PAGE } from "./directusConstants";
import { ArticleSlugInfo } from "./directusInterfaces";

export async function fetchArticleSlugs(
  page: number = 1, 
  sort: string = 'desc',
  lang: string,
  category?: string, 
  search?: string,
  excludeSlugs: string[] = [],
  authorSlug?: string,
  rubricSlug?: string,
  includesDrafts: boolean = false
): Promise<{ slugs: ArticleSlugInfo[], hasMore: boolean, totalCount: number }> {
  try {
    console.log('🔍 fetchArticleSlugs called with:', { page, sort, category, search, lang });

    let filter: any = {};

    const statusFilter = includesDrafts 
      ? { status: { _in: ['published', 'draft'] } }
      : { status: { _eq: 'published' } };
    
    filter = { ...filter, ...statusFilter };

    if (category) {
      filter["category_slugs"] = {
        "categories_slug": {
          "_eq": category
        }
      };
    }

    if (search) {
      filter["_or"] = [
        { "translations": { "title": { "_icontains": search } } },
        { "translations": { "description": { "_icontains": search } } }
      ];
    }

    if (excludeSlugs.length > 0) {
      filter["slug"] = {
        "_nin": excludeSlugs
      };
    }

    if (authorSlug) {
      filter["author_slugs"] = {
        "authors_slug": {
          "_eq": authorSlug
        }
      };
    }

    if (rubricSlug) {
      filter["rubric_slug"] = {
        "_eq": rubricSlug
      };
    }

    const encodedFilter = encodeURIComponent(JSON.stringify(filter));
    const sortQuery = sort === 'asc' ? 'published_at' : '-published_at';
    
    // Build URL with translation fields
    let slugUrl = `${DIRECTUS_URL}/items/articles?fields=slug,layout,translations.languages_code,translations.title,translations.local_slug&sort=${sortQuery}&limit=-1`;
    
    if (Object.keys(filter).length > 0) {
      slugUrl += `&filter=${encodedFilter}`;
    }

    // Add deep filter for language if specified
    if (lang) {
      const deepFilter = encodeURIComponent(JSON.stringify({
        translations: {
          _filter: {
            languages_code: { _eq: lang }
          }
        }
      }));
      slugUrl += `&deep=${deepFilter}`;
    }

    console.log('📡 Fetching URL:', slugUrl);

    const slugsResponse = await fetch(slugUrl, { 
      cache: includesDrafts ? 'no-store' : 'default',
      next: includesDrafts ? undefined : (search ? { revalidate: 0 } : { 
        revalidate: 300,
        tags: ['articles', 'article-list']
      })
    });

    if (!slugsResponse.ok) {
      throw new Error(`Failed to fetch article data. Status: ${slugsResponse.status}`);
    }

    const slugsData = await slugsResponse.json();
    
    console.log(`📦 Fetched ${slugsData.data.length} articles from Directus`);

    // Filter and map articles
    let allFilteredSlugs: ArticleSlugInfo[] = slugsData.data
      .filter((item: any) => {
        if (!lang) {
          console.log(`  ✅ ${item.slug}: No lang filter, including`);
          return true; // No language filter
        }
        
        // Check if translations exist and have the requested language with non-null title
        if (!item.translations || item.translations.length === 0) {
          console.log(`  ❌ ${item.slug}: No translations returned (deep filter excluded it or no translation exists)`);
          return false;
        }
        
        // Deep filter should return only requested language
        const translation = item.translations[0]; // Should be only one due to deep filter
        
        if (translation.languages_code !== lang) {
          console.log(`  ⚠️ ${item.slug}: Unexpected - translation language is ${translation.languages_code}, expected ${lang}`);
          return false;
        }
        
        if (!translation.title) {
          console.log(`  ❌ ${item.slug}: Translation exists but title is null`);
          return false;
        }
        
        console.log(`  ✅ ${item.slug}: Valid ${lang} translation (title: "${translation.title?.substring(0, 30)}...")`);
        return true;
      })
      .map((item: any) => {
        let slugToUse = item.slug;
        
        // Use local_slug if available
        if (lang && item.translations && item.translations.length > 0) {
          const translation = item.translations[0];
          if (translation.local_slug) {
            console.log(`    🔄 ${item.slug} → ${translation.local_slug} (using local_slug)`);
            slugToUse = translation.local_slug;
          }
        }
        
        return {
          slug: slugToUse,
          layout: item.layout
        };
      });
    
    console.log(`\n✨ After filtering: ${allFilteredSlugs.length} articles for lang=${lang}`);
    console.log(`📝 Filtered slugs:`, allFilteredSlugs.map(s => s.slug).join(', '));

    // Paginate
    const totalCount = allFilteredSlugs.length;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    const slugs = allFilteredSlugs.slice(startIndex, endIndex);
    const hasMore = endIndex < totalCount;

    console.log(`\n📄 Page ${page}: Returning ${slugs.length} items (total: ${totalCount}, hasMore: ${hasMore})`);
    console.log(`📍 Slugs on this page:`, slugs.map(s => s.slug).join(', '));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return { slugs, hasMore, totalCount };
  } catch (error) {
    console.error('❌ Error in fetchArticleSlugs:', error);
    throw error;
  }
}