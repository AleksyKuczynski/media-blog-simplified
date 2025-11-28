// frontend/src/main/lib/directus/fetchArticles.ts

import { Lang } from "@/config/i18n";
import { DIRECTUS_URL } from "./directusConstants";
import { ArticleCardType } from "./directusInterfaces";

export async function fetchArticles(
  slugsAndLayouts: { slug: string; layout: string }[], 
  lang: Lang, 
  sort: string = 'desc',
  includesDrafts: boolean = false
): Promise<ArticleCardType[]> {
  try {
    if (slugsAndLayouts.length === 0) {
      return [];
    }

    const statusFilter = includesDrafts 
      ? { status: { _in: ['published', 'draft'] } }
      : { status: { _eq: 'published' } };

    const filter = {
      _and: [
        { _or: slugsAndLayouts.map(({ slug }) => ({ slug: { _eq: slug } })) },
        statusFilter
      ]
    };

    const encodedFilter = encodeURIComponent(JSON.stringify(filter));
    const fields = 'slug,status,layout,published_at,external_link,article_heading_img,rubric_slug.slug,translations.*';
    const sortQuery = sort === 'asc' ? 'published_at' : '-published_at';
    const url = `${DIRECTUS_URL}/items/articles?fields=${fields}&filter=${encodedFilter}&sort=${sortQuery}`;

    const response = await fetch(url, { 
      cache: includesDrafts ? 'no-store' : 'default',
      next: includesDrafts ? undefined : { 
        revalidate: 300,
        tags: ['articles', 'article-data']
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch articles. Status: ${response.status}`);
    }

    const data = await response.json();
    const layoutMap = new Map(slugsAndLayouts.map(item => [item.slug, item.layout]));

    const articles: ArticleCardType[] = data.data.map((article: any) => {
      const translation = article.translations.find((t: any) => t.languages_code === lang) || article.translations[0];
      return { 
        ...article, 
        rubric_slug: article.rubric_slug?.slug || '',
        authors: [{ last_name: 'Editorial', slug: '' }],
        layout: layoutMap.get(article.slug) || article.layout,
        title: translation?.title || '',
        description: translation?.description || '',
      } as ArticleCardType;
    });

    return articles;
  } catch (error) {
    throw error;
  }
}