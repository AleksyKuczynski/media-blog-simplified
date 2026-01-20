// /src/api/directus/fetchArticleSlugs.ts

import { DIRECTUS_URL, ITEMS_PER_PAGE } from "./directusConstants";
import { ArticleSlugInfo } from "./directusInterfaces";

const DIRECTUS_API_TOKEN = process.env.DIRECTUS_API_TOKEN;

export async function fetchArticleSlugs(
  page: number = 1, 
  sort: string = 'desc',
  lang: string,
  category?: string, 
  search?: string,
  excludeSlugs: string[] = [],
  authorSlug?: string,
  illustratorSlug?: string,
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

    if (illustratorSlug) {
    filter["illustrator_slug"] = {
      "_eq": illustratorSlug
    };
  }

    if (rubricSlug) {
      filter["rubric_slug"] = {
        "_eq": rubricSlug
      };
    }

    const encodedFilter = encodeURIComponent(JSON.stringify(filter));
    
    // For engagement-based sorting, we'll fetch all and sort in code
    // For date-based sorting, use database sort
    const needsEngagementSort = sort === 'likes' || sort === 'views';
    const sortQuery = needsEngagementSort ? '-published_at' : (sort === 'asc' ? 'published_at' : '-published_at');
    
    // Build fields query
    const fields = 'slug,layout,published_at,translations.languages_code,translations.title,translations.local_slug';
    
    // Build URL
    let slugUrl = `${DIRECTUS_URL}/items/articles?fields=${fields}&sort=${sortQuery}&limit=-1`;
    
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

    // Filter articles
    let articles = slugsData.data.filter((item: any) => {
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
    });

    // If engagement-based sorting, fetch engagement data
    if (needsEngagementSort && articles.length > 0) {
      const articleSlugs = articles.map((a: any) => a.slug);
      
      // Fetch engagement data for all articles
      const engagementFilter = encodeURIComponent(
        JSON.stringify({
          article_slug: { _in: articleSlugs }
        })
      );
      
      const engagementUrl = `${DIRECTUS_URL}/items/articles_engagement?filter=${engagementFilter}&fields=article_slug,like_count,view_count&limit=-1`;
      
      const engagementResponse = await fetch(engagementUrl, {
        headers: DIRECTUS_API_TOKEN ? { 
          'Authorization': `Bearer ${DIRECTUS_API_TOKEN}` 
        } : undefined,
        cache: 'no-store'
      });

      if (engagementResponse.ok) {
        const engagementData = await engagementResponse.json();
        
        // Create a map of slug -> engagement stats
        const engagementMap = new Map<string, { likes: number; views: number }>();
        engagementData.data.forEach((item: any) => {
          engagementMap.set(item.article_slug, {
            likes: item.like_count || 0,
            views: item.view_count || 0
          });
        });

        // Add engagement data to articles (default to 0 if not found)
        articles = articles.map((article: any) => ({
          ...article,
          engagement: engagementMap.get(article.slug) || { likes: 0, views: 0 }
        }));

        // Sort by engagement
        articles.sort((a: any, b: any) => {
          const sortField = sort === 'likes' ? 'likes' : 'views';
          const diff = b.engagement[sortField] - a.engagement[sortField];
          
          // If engagement is equal, sort by date (newest first)
          if (diff === 0) {
            return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
          }
          
          return diff;
        });
      }
    }

    // Map to ArticleSlugInfo
    const allFilteredSlugs: ArticleSlugInfo[] = articles.map((item: any) => ({
      slug: item.slug,
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