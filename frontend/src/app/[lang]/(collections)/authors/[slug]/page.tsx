// src/app/[lang]/(collections)/authors/[slug]/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import Image from 'next/image';
import { fetchAuthorBySlug, DIRECTUS_ASSETS_URL, fetchArticleSlugs, ITEMS_PER_PAGE } from '@/api/directus/index';
import ArticleList from '@/features/article-display/ArticleList';
import { ArticleListSkeleton } from '@/features/article-display/ArticleListSkeleton';
import Pagination from '@/shared/ui/Pagination';
import Section from '@/features/layout/Section';
import StandardError from '@/shared/errors/StandardError';
import { processTemplate } from '@/config/i18n/helpers/templates';
import generateAuthorMetadata from '@/shared/seo/metadata/AuthorMetadata';
import AuthorSchema from '@/shared/seo/schemas/AuthorSchema';
import { getDictionary, Lang } from '@/config/i18n';
import { safeGenerateMetadata } from '@/shared/errors/lib/metadataErrorHandler';
import CollectionCount from '@/features/layout/CollectionCount';
import { SECTION_COUNT_STYLES } from '@/features/layout/layout.styles';
import { AuthorSocialLinks } from '@/features/author-display/AuthorSocialLinks';
import { cn } from '@/lib/utils';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: Lang, slug: string }> 
}): Promise<Metadata> {
  return safeGenerateMetadata(params, 'author', async (lang, dictionary, resolvedParams) => {
    const { slug } = resolvedParams;

    // Skip metadata generation for non-author requests (e.g. .map, .js files)
    if (slug.includes('.')) {
      return {};
    }
    
    const author = await fetchAuthorBySlug(slug, lang);
    
    if (!author) {
      throw new Error('Author not found');
    }

    // Count both authored and illustrated articles
    const [authoredResult, illustratedResult] = await Promise.all([
      fetchArticleSlugs(1, 'desc', lang, undefined, undefined, [], slug, undefined, undefined),
      fetchArticleSlugs(1, 'desc', lang, undefined, undefined, [], undefined, slug, undefined),
    ]);

    const totalCount = authoredResult.totalCount + illustratedResult.totalCount;

    return generateAuthorMetadata({
      dictionary,
      authorData: {
        name: author.name,
        slug: slug,
        bio: author.bio,
        avatar: author.avatar,
        articleCount: totalCount,
        path: `/${lang}/authors/${slug}`,
        featured: false,
      },
    });
  });
}

export default async function AuthorPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ lang: Lang, slug: string }>, 
  searchParams: Promise<{ page?: string, sort?: string }> 
}) {
  const resolvedParams = await params;
  const { lang, slug } = resolvedParams;
  const dictionary = await getDictionary(lang);

  const author = await fetchAuthorBySlug(slug, lang);
  
  if (!author) {
    return <StandardError dictionary={dictionary} contentType="author" />;
  }

  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1', 10);
  const sort = resolvedSearchParams.sort || 'desc';

  // Fetch both authored and illustrated articles
  const [authoredResult, illustratedResult] = await Promise.all([
    fetchArticleSlugs(page, sort, lang, undefined, undefined, [], slug, undefined, undefined),
    fetchArticleSlugs(page, sort, lang, undefined, undefined, [], undefined, slug, undefined),
  ]);

  const { slugs: authoredSlugs, totalCount: authoredCount } = authoredResult;
  const { slugs: illustratedSlugs, totalCount: illustratedCount } = illustratedResult;

  const totalPages = Math.ceil(authoredCount / ITEMS_PER_PAGE);
  const illustratedTotalPages = Math.ceil(illustratedCount / ITEMS_PER_PAGE);
  const currentPath = `/${lang}/authors/${slug}`;

  const AUTHOR_PAGE_STYLES = {
    header: {
      section: 'pb-40',
      container: 'container mx-auto px-4',
      layout: 'flex flex-col md:flex-row gap-6 max-w-6xl mx-auto',
      
      leftColumn: 'w-full max-w-md mx-auto md:w-1/3 flex flex-col gap-6',
      rightColumn: 'w-full md:w-2/3',
      
      avatar: {
        wrapper: 'relative aspect-square w-4/5 mx-auto overflow-hidden rounded-full shadow-md',
        image: 'object-cover',
        fallback: 'w-4/5 mx-auto aspect-square flex items-center justify-center bg-gradient-to-br from-pr-cont to-pr-fix overflow-hidden rounded-full shadow-md',
        fallbackText: 'text-on-pr-cont text-6xl font-bold',
      },
      
      nameCard: 'p-6 bg-sf-hi rounded-2xl shadow-sm',
      name: 'text-lg sm:text-xl xl:text-2xl uppercase text-center text-on-sf',
      
      bioCard: 'p-8 bg-sf-cont rounded-2xl shadow-md font-serif leading-relaxed lg:text-lg',
      bio: 'text-on-sf-var',

      social: 'flex flex-wrap gap-2 mt-8 sm:mt-10 md:mt-12 lg:mt-16 justify-center md:justify-end',
      socialLink: cn(
        'font-medium text-on-sec hover:text-on-sec-var',
        'underline underline-offset-2 transition-colors',
        'bg-sf-hi hover:bg-sf-hi-fix',
        'shadow-sm hover:shadow-lg focus:shadow-sm',
        'rounded-lg sm:rounded-xl',
        'px-4 py-2 sm:px-6 sm:py-4 lg:px-8 lg:py-5',
        'disabled:pointer-events-none disabled:opacity-50'
      ),
    },
  } as const;

  return (
    <>
      <AuthorSchema
        dictionary={dictionary}
        authorData={{
          name: author.name,
          slug: slug,
          bio: author.bio,
          avatar: author.avatar,
          articleCount: authoredCount + illustratedCount,
        }}
        currentPath={currentPath}
      />

      {/* Author Header */}
      <section className={AUTHOR_PAGE_STYLES.header.section}>
        <div className={AUTHOR_PAGE_STYLES.header.container}>
          <div className={AUTHOR_PAGE_STYLES.header.layout}>
            {/* Left Column: Avatar + Name (1/3) */}
            <div className={AUTHOR_PAGE_STYLES.header.leftColumn}>
              {/* Avatar */}
              {author.avatar ? (
                <div className={AUTHOR_PAGE_STYLES.header.avatar.wrapper}>
                  <Image
                    src={`${DIRECTUS_ASSETS_URL}/assets/${author.avatar}`}
                    alt={processTemplate(dictionary.sections.authors.authorPhoto, {
                      name: author.name
                    })}
                    fill
                    className={AUTHOR_PAGE_STYLES.header.avatar.image}
                    sizes="(max-width: 768px) 80vw, 320px"
                    priority
                  />
                </div>
              ) : (
                <div className={AUTHOR_PAGE_STYLES.header.avatar.fallback}>
                  <span className={AUTHOR_PAGE_STYLES.header.avatar.fallbackText}>
                    {author.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Name */}
              <div className={AUTHOR_PAGE_STYLES.header.nameCard}>
                <h1 
                  className={AUTHOR_PAGE_STYLES.header.name}
                  itemProp="name"
                >
                  {author.name}
                </h1>
              </div>
            </div>

            {/* Right Column: Bio + Social links (2/3) */}
            <div className={AUTHOR_PAGE_STYLES.header.rightColumn}>
              {author.bio && (
                <div className={AUTHOR_PAGE_STYLES.header.bioCard}>
                  <p
                    className={AUTHOR_PAGE_STYLES.header.bio}
                    itemProp="description"
                  >
                    {author.bio}
                  </p>
                </div>
              )}
              <AuthorSocialLinks
                author={author}
                labels={dictionary.sections.socialLinks}
                className={AUTHOR_PAGE_STYLES.header.social}
                linkClassName={AUTHOR_PAGE_STYLES.header.socialLink}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Articles by Author Section */}
      {authoredCount > 0 && (
        <Section
          title={processTemplate(dictionary.sections.authors.articlesWrittenBy, {
            author: author.name
          })}
          shortTitle={dictionary.sections.authors.articlesShort}
          variant="secondary"
          hasNextSectionTitle={true}
        >
          <CollectionCount 
            count={authoredCount}
            countLabel={dictionary.common.count.articles}
            dictionary={dictionary}
            className={SECTION_COUNT_STYLES}
          />
          
          <div className="container mx-auto px-4">
            <Suspense fallback={<ArticleListSkeleton count={6} ariaLabel={dictionary.common.status.loading} />}>
              <ArticleList 
                slugInfos={authoredSlugs} 
                lang={lang}
                dictionary={dictionary}
                fromContext={`author:${slug}`}
              />
              {totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  dictionary={dictionary}
                />
              )}
            </Suspense>
          </div>
        </Section>
      )}

      {/* Articles Illustrated by Author Section */}
      {illustratedCount > 0 && (
        <Section 
          title={`${dictionary.sections.labels.illustratedBy} ${author.name}`}
          shortTitle={dictionary.sections.labels.illustratedByShort}
          hasNextSectionTitle={true}
          variant="tertiary"
        >
          <CollectionCount 
            count={illustratedCount}
            countLabel={dictionary.common.count.articles}
            dictionary={dictionary}
            className={SECTION_COUNT_STYLES}
          />
          
          <div className="container mx-auto px-4">
            <Suspense fallback={<ArticleListSkeleton count={6} ariaLabel={dictionary.common.status.loading} />}>
              <ArticleList 
                slugInfos={illustratedSlugs} 
                lang={lang}
                dictionary={dictionary}
                fromContext={`author:${slug}`}
              />
              {illustratedTotalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={illustratedTotalPages}
                  dictionary={dictionary}
                />
              )}
            </Suspense>
          </div>
        </Section>
      )}
    </>
  );
}