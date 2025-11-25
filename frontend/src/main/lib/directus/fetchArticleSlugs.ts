// frontend/src/main/lib/directus/fetchArticleSlugs.ts
// FIXED: Added totalCount to return value

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
  includesDrafts: boolean = false
): Promise<{ slugs: ArticleSlugInfo[], hasMore: boolean, totalCount: number }> {
  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const sortQuery = sort === 'asc' ? 'published_at' : '-published_at';
    
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
    
    // Fetch slugs with +1 to check hasMore AND meta for filtered count
    let slugUrl = `${DIRECTUS_URL}/items/articles?fields=slug,layout&sort=${sortQuery}&limit=${ITEMS_PER_PAGE + 1}&offset=${offset}&meta=filter_count`;
    
    if (Object.keys(filter).length > 0) {
      slugUrl += `&filter=${encodedFilter}`;
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

    let slugs: ArticleSlugInfo[] = slugsData.data.map((item: { slug: string, layout: string }) => ({
      slug: item.slug,
      layout: item.layout
    }));
    
    const hasMore = slugs.length > ITEMS_PER_PAGE;
    
    if (hasMore) {
      slugs = slugs.slice(0, ITEMS_PER_PAGE);
    }

    // Extract filtered count from meta (respects all filters)
    const totalCount = slugsData.meta?.filter_count || 0;

    return { slugs, hasMore, totalCount };
  } catch (error) {
    console.error('Error in fetchArticleSlugs:', error);
    throw error;
  }
}