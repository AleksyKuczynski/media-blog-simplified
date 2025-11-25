// frontend/src/main/lib/directus/fetchArticleSlugs.ts
// DEBUG VERSION - with comprehensive logging

import { DIRECTUS_URL, ITEMS_PER_PAGE } from "./directusConstants";
import { ArticleSlugInfo } from "./directusInterfaces";

export async function fetchArticleSlugs(
  page: number = 1, 
  sort: string = 'desc', 
  category?: string, 
  search?: string,
  excludeSlugs: string[] = [],
  authorSlug?: string,
  rubricSlug?: string,
  includesDrafts: boolean = false,
  lang?: string
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
    
    let slugUrl = `${DIRECTUS_URL}/items/articles?fields=slug,layout,translations.languages_code,translations.title,translations.local_slug&sort=${sortQuery}&limit=-1`;
    
    if (Object.keys(filter).length > 0) {
      slugUrl += `&filter=${encodedFilter}`;
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

    // Debug: Log first 3 articles to see structure
    if (slugsData.data.length > 0) {
      console.log('📋 Sample article structure (first 3):');
      slugsData.data.slice(0, 3).forEach((item: any, idx: number) => {
        console.log(`  Article ${idx + 1}: ${item.slug}`);
        console.log(`    Translations:`, item.translations?.map((t: any) => ({
          lang: t.languages_code,
          title: t.title,
          local_slug: t.local_slug
        })));
      });
    }

    let allFilteredSlugs: ArticleSlugInfo[] = slugsData.data
      .filter((item: any) => {
        if (!lang) {
          console.log(`  ✅ ${item.slug}: No lang filter, including`);
          return true;
        }
        
        if (!item.translations || item.translations.length === 0) {
          console.log(`  ❌ ${item.slug}: No translations at all`);
          return false;
        }
        
        const translation = item.translations.find((t: any) => t.languages_code === lang);
        
        if (!translation) {
          console.log(`  ❌ ${item.slug}: No ${lang} translation found`);
          return false;
        }
        
        if (!translation.title) {
          console.log(`  ❌ ${item.slug}: ${lang} translation exists but title is null`);
          console.log(`      Translation data:`, translation);
          return false;
        }
        
        console.log(`  ✅ ${item.slug}: Valid ${lang} translation (title: "${translation.title?.substring(0, 30)}...")`);
        return true;
      })
      .map((item: any) => {
        let slugToUse = item.slug;
        
        if (lang && item.translations) {
          const translation = item.translations.find((t: any) => t.languages_code === lang);
          if (translation && translation.local_slug) {
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