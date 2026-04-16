// frontend/src/api/directus/fetchArticleContributors.ts

import { AuthorDetails, DIRECTUS_URL } from "./index";
import { Lang } from "@/config/i18n";

interface ArticleContributors {
  authorsWithDetails: AuthorDetails[];
  illustratorWithDetails?: AuthorDetails;
}

export async function fetchArticleContributors(
  slug: string, 
  lang: Lang
): Promise<ArticleContributors> {
  try {
    const fields = [
      // Authors via junction table
      'author_slugs.authors_slug.slug',
      'author_slugs.authors_slug.avatar',
      'author_slugs.authors_slug.telegram_url',
      'author_slugs.authors_slug.translations.name',
      'author_slugs.authors_slug.translations.bio',
      'author_slugs.authors_slug.translations.credentials',
      'author_slugs.authors_slug.translations.expertise_areas',
      'author_slugs.authors_slug.translations.meta_description',
      'author_slugs.authors_slug.translations.languages_code',
      
      // Illustrator direct relation
      'illustrator_slug.slug',
      'illustrator_slug.avatar',
      'illustrator_slug.telegram_url',
      'illustrator_slug.translations.name',
      'illustrator_slug.translations.bio',
      'illustrator_slug.translations.credentials',
      'illustrator_slug.translations.expertise_areas',
      'illustrator_slug.translations.meta_description',
      'illustrator_slug.translations.languages_code',
    ].join(',');

    const filter = encodeURIComponent(JSON.stringify({
      slug: { _contains: slug }
    }));

    const deepFilter = encodeURIComponent(JSON.stringify({
      author_slugs: {
        authors_slug: {
          translations: {
            _filter: {
              languages_code: { _eq: lang }
            }
          }
        }
      },
      illustrator_slug: {
        translations: {
          _filter: {
            languages_code: { _eq: lang }
          }
        }
      }
    }));

    const url = `${DIRECTUS_URL}/items/articles?fields=${fields}&filter=${filter}&deep=${deepFilter}`;
    
    const response = await fetch(url, { 
      next: {
        revalidate: 3600,
        tags: ['authors', 'illustrators', 'article-contributors']
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch article contributors. Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return {
        authorsWithDetails: [],
        illustratorWithDetails: undefined,
      };
    }

    const article = data.data[0];

    // Process authors
    const authorsWithDetails: AuthorDetails[] = [];
    
    article.author_slugs?.forEach((item: any) => {
      const authorData = item.authors_slug;
      const translation = authorData.translations?.[0];
      
      if (translation) {
        authorsWithDetails.push({
          slug: authorData.slug,
          name: translation.name || authorData.slug,
          bio: translation.bio || '',
          avatar: authorData.avatar || '',
          telegram_url: authorData.telegram_url,
          credentials: translation.credentials,
          expertise_areas: translation.expertise_areas,
          meta_description: translation.meta_description,
          is_author: authorData.is_author,
          is_illustrator: authorData.is_illustrator,
        });
      }
    });

    // Process illustrator
    let illustratorWithDetails: AuthorDetails | undefined;
    
    if (article.illustrator_slug) {
      const illustratorData = article.illustrator_slug;
      const translation = illustratorData.translations?.[0];
      
      if (translation) {
        illustratorWithDetails = {
          slug: illustratorData.slug,
          name: translation.name || illustratorData.slug,
          bio: translation.bio || '',
          avatar: illustratorData.avatar || '',
          telegram_url: illustratorData.telegram_url,
          credentials: translation.credentials,
          expertise_areas: translation.expertise_areas,
          meta_description: translation.meta_description,
          is_author: illustratorData.is_author,
          is_illustrator: illustratorData.is_illustrator,
        };
      }
    }

    return {
      authorsWithDetails,
      illustratorWithDetails,
    };
  } catch (error) {
    console.error('Error in fetchArticleContributors:', error);
    return {
      authorsWithDetails: [],
      illustratorWithDetails: undefined,
    };
  }
}