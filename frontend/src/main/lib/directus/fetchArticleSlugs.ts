// frontend/src/main/lib/directus/fetchArticleSlugs.ts

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
  includesDrafts: boolean = false // NEW PARAMETER
): Promise<{ slugs: ArticleSlugInfo[], hasMore: boolean }> {
  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const sortQuery = sort === 'asc' ? 'published_at' : '-published_at';
    
    let filter: any = {};

    // Status filter based on preview mode
    const statusFilter = includesDrafts 
      ? { status: { _in: ['published', 'draft'] } }
      : { status: { _eq: 'published' } };
    
    filter = { ...filter, ...statusFilter };

    // ... rest of existing filter logic (category, search, etc.) ...

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
    
    let url = `${DIRECTUS_URL}/items/articles?fields=slug,layout&sort=${sortQuery}&limit=${ITEMS_PER_PAGE + 1}&offset=${offset}`;
    
    if (Object.keys(filter).length > 0) {
      url += `&filter=${encodedFilter}`;
    }

    const response = await fetch(url, { 
      cache: includesDrafts ? 'no-store' : 'default',
      next: includesDrafts ? undefined : (search ? { revalidate: 0 } : { 
        revalidate: 300,
        tags: ['articles', 'article-list']
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch article slugs. Status: ${response.status}`);
    }

    const slugsData = await response.json();
    let slugs: ArticleSlugInfo[] = slugsData.data.map((item: { slug: string, layout: string }) => ({
      slug: item.slug,
      layout: item.layout
    }));
    
    const hasMore = slugs.length > ITEMS_PER_PAGE;
    
    if (hasMore) {
      slugs = slugs.slice(0, ITEMS_PER_PAGE);
    }

    return { slugs, hasMore };
  } catch (error) {
    console.error('Error in fetchArticleSlugs:', error);
    throw error;
  }
}