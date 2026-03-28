// frontend/src/api/directus/fetchAllAuthors.ts
import { Lang } from "@/config/i18n";
import { AuthorDetails, DIRECTUS_URL } from "./index";

export async function fetchAllAuthors(
  lang: Lang,
  roleFilter?: 'author' | 'illustrator'
): Promise<AuthorDetails[]> {
  try {
    const roleQueryFilter = roleFilter === 'author'
      ? '&filter[is_author][_eq]=true'
      : roleFilter === 'illustrator'
      ? '&filter[is_illustrator][_eq]=true'
      : '';

    const authorsUrl = `${DIRECTUS_URL}/items/authors?fields=slug,avatar,is_author,is_illustrator${roleQueryFilter}&sort=slug`;
    
    const authorsResponse = await fetch(authorsUrl, { 
      next: { 
        revalidate: 3600,
        tags: ['authors', 'structure']
      }
    });
    
    if (!authorsResponse.ok) {
      throw new Error(`Failed to fetch authors. Status: ${authorsResponse.status}`);
    }

    const authorsData = await authorsResponse.json();
    const authors = authorsData.data;
    const slugs = authors.map((author: any) => author.slug);

    // Fetch translations and counts in parallel
    const [translationsResponse, countsPromises] = await Promise.all([
      fetch(
        `${DIRECTUS_URL}/items/authors_translations?filter[authors_slug][_in]=${slugs.join(',')}&filter[languages_code][_eq]=${lang}&fields=authors_slug,name,bio`,
        { 
          next: { 
            revalidate: 3600,
            tags: ['authors', 'translations']
          }
        }
      ),
      Promise.all(
        slugs.map(async (slug: string) => {
          // For illustrators, count by illustrator_slug instead of junction table
          if (roleFilter === 'illustrator') {
            const countUrl = `${DIRECTUS_URL}/items/articles?filter[illustrator_slug][_eq]=${slug}&filter[status][_eq]=published&aggregate[count]=*`;
            const countResponse = await fetch(countUrl, { 
              next: { 
                revalidate: 3600,
                tags: ['authors', 'article-counts']
              }
            });
            const countData = await countResponse.json();
            return {
              slug,
              count: countData.data?.[0]?.count || 0
            };
          } else {
            // For authors, use the junction table
            const countUrl = `${DIRECTUS_URL}/items/articles?filter[author_slugs][authors_slug][_eq]=${slug}&filter[status][_eq]=published&aggregate[count]=*`;
            const countResponse = await fetch(countUrl, { 
              next: { 
                revalidate: 3600,
                tags: ['authors', 'article-counts']
              }
            });
            const countData = await countResponse.json();
            return {
              slug,
              count: countData.data?.[0]?.count || 0
            };          
          }
        })
      )
    ]);

    if (!translationsResponse.ok) {
      throw new Error(`Failed to fetch author translations. Status: ${translationsResponse.status}`);
    }

    const translationsData = await translationsResponse.json();
    const translations = translationsData.data;
    const counts = await countsPromises;

    const completeAuthors: AuthorDetails[] = authors.map((author: any) => {
      const translation = translations.find((t: any) => t.authors_slug === author.slug);
      const countData = counts.find((c) => c.slug === author.slug);
      
      return {
        slug: author.slug,
        avatar: author.avatar || '',
        is_author: author.is_author,
        is_illustrator: author.is_illustrator,
        name: translation ? translation.name : author.slug,
        bio: translation ? translation.bio : '',
        articleCount: countData?.count || 0
      };
    });

    return completeAuthors;
  } catch (error) {
    console.error('Error fetching authors:', error);
    return [];
  }
}