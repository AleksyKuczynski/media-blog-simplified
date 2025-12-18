// /src/api/directus/fetchArticleSlugs.ts

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

    // Filter and map articles
    let allFilteredSlugs: ArticleSlugInfo[] = slugsData.data
      .filter((item: any) => {
        if (!lang) {
          return true;
        }
        
        if (!item.translations || item.translations.length === 0) {
          return false;
        }
        
        const translation = item.translations[0];
        
        if (translation.languages_code !== lang) {
          return false;
        }
        
        if (!translation.title) {
          return false;
        }
        
        return true;
      })
      .map((item: any) => ({
        slug: item.slug,  // Always main slug
        layout: item.layout
      }));

    // Paginate
    const totalCount = allFilteredSlugs.length;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    const slugs = allFilteredSlugs.slice(startIndex, endIndex);
    const hasMore = endIndex < totalCount;

    return { slugs, hasMore, totalCount };
  } catch (error) {
    throw error;
  }
}