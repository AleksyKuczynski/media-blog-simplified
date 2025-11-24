// src/app/[lang]/authors/[slug]/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { fetchAuthorBySlug, fetchRubricBasics, DIRECTUS_URL, fetchArticleSlugs, ArticleSlugInfo } from '@/main/lib/directus/index';
import ArticleList from '@/main/components/Main/ArticleList';
import Breadcrumbs from '@/main/components/Navigation/Breadcrumbs/Breadcrumbs';
import LoadMoreButton from '@/main/components/Main/LoadMoreButton';
import Section from '@/main/components/Main/Section';
import { getLocalizedArticleCount } from '@/main/lib/dictionary/helpers/content';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import generateAuthorMetadata from '@/main/components/SEO/metadata/AuthorMetadata';
import AuthorSchema from '@/main/components/SEO/schemas/AuthorSchema';
import { getDictionary, Lang } from '@/main/lib/dictionary';
import { safeGenerateMetadata } from '@/main/lib/errors/metadataErrorHandler';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: Lang, slug: string }> 
}): Promise<Metadata> {
  return safeGenerateMetadata(params, 'author', async (lang, dictionary, resolvedParams) => {
    const { slug } = resolvedParams;
    
    const author = await fetchAuthorBySlug(slug, lang);
    
    if (!author) {
      throw new Error('Author not found');
    }

    const { slugs } = await fetchArticleSlugs(1, 'desc', undefined, undefined, [], slug);
    const articleCount = slugs.length;

    return generateAuthorMetadata({
      dictionary,
      authorData: {
        name: author.name,
        slug: slug,
        bio: author.bio,
        avatar: author.avatar,
        articleCount,
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
  try {
    const { lang, slug } = await params;
    const resolvedSearchParams = await searchParams;
    const dictionary = getDictionary(lang as Lang);
    const currentPage = Number(resolvedSearchParams.page) || 1;

    const [author, rubricBasics] = await Promise.all([
      fetchAuthorBySlug(slug, lang),
      fetchRubricBasics(lang),
    ]);

    if (!author) {
      notFound();
    }

    let allSlugInfos: ArticleSlugInfo[] = [];
    let hasMore = false;

    for (let page = 1; page <= currentPage; page++) {
      const { slugs, hasMore: pageHasMore } = await fetchArticleSlugs(
        page,
        'desc',
        undefined,
        undefined,
        [],
        slug
      );
      allSlugInfos = [...allSlugInfos, ...slugs];
      hasMore = pageHasMore;
      if (!pageHasMore) break;
    }

    const breadcrumbItems = [
      {
        label: dictionary.navigation.labels.home,
        href: `/${lang}`,
      },
      {
        label: dictionary.navigation.labels.authors,
        href: `/${lang}/authors`,
      },
      {
        label: author.name,
        href: `/${lang}/authors/${slug}`,
      },
    ];

    const articlesForSchema = allSlugInfos.slice(0, 10).map(slugInfo => ({
      title: slugInfo.slug,
      slug: slugInfo.slug,
      url: `${dictionary.seo.site.url}/${lang}/authors/${slug}/${slugInfo.slug}`,
    }));

    const articleCountText = getLocalizedArticleCount(dictionary, allSlugInfos.length);

    return (
      <>
        {/* Schema and Breadcrumbs */}
        <AuthorSchema
          dictionary={dictionary}
          authorData={{
            name: author.name,
            slug: slug,
            bio: author.bio,
            avatar: author.avatar,
            articleCount: allSlugInfos.length,
            articles: articlesForSchema,
          }}
          currentPath={`/${lang}/authors/${slug}`}
        />
        
        <Breadcrumbs 
          items={breadcrumbItems} 
          rubrics={rubricBasics}
          lang={lang}
          translations={{
            home: dictionary.navigation.labels.home,
            allRubrics: dictionary.navigation.labels.rubrics,
            allAuthors: dictionary.navigation.labels.authors,
          }}
        />

        {/* Author Profile Section */}
        <Section 
          className="py-8"
          ariaLabel={processTemplate(dictionary.breadcrumb.templates.authorProfile, {
            name: author.name
          })}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar */}
              {author.avatar ? (
                <div className="relative w-48 h-48 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={`${DIRECTUS_URL}/assets/${author.avatar}`}
                    alt={processTemplate(dictionary.sections.authors.authorPhoto, {
                      name: author.name
                    })}
                    fill
                    className="object-cover"
                    sizes="192px"
                    priority
                  />
                </div>
              ) : (
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-pr-cont to-pr-fix flex items-center justify-center flex-shrink-0">
                  <span className="text-on-pr-cont text-6xl font-bold">
                    {author.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              {/* Author Info */}
              <div className="flex-1">
                <h1 
                  className="text-4xl font-bold mb-4 text-on-sf"
                  itemProp="name"
                >
                  {author.name}
                </h1>
                
                {author.bio && (
                  <p 
                    className="text-lg text-on-sf-var mb-4 max-w-3xl"
                    itemProp="description"
                  >
                    {author.bio}
                  </p>
                )}
                
                <p className="text-sm text-muted-foreground">
                  {processTemplate(dictionary.sections.templates.totalCount, {
                    count: allSlugInfos.length.toString(),
                    countLabel: dictionary.common.count.articles
                  })}
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* Articles Section */}
        <Section 
          className="py-8 bg-muted/30"
          ariaLabel={processTemplate(dictionary.sections.templates.itemsInCollectionDescription, {
            items: dictionary.sections.labels.articles,
            collection: processTemplate(dictionary.sections.templates.itemByAuthor, {
              item: dictionary.sections.labels.articles,
              author: author.name
            }),
            siteName: dictionary.seo.site.name
          })}
        >
          <div className="container mx-auto px-4">
            <header className="mb-8">
              <h2 className="text-3xl font-bold text-on-sf">
                {processTemplate(dictionary.sections.authors.articlesWrittenBy, {
                  author: author.name
                })}
              </h2>
            </header>
            
            <Suspense fallback={
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-prcolor mx-auto mb-4"></div>
                <p className="text-on-sf-var">{dictionary.common.status.loading}</p>
              </div>
            }>
              {allSlugInfos.length > 0 ? (
                <>
                  <ArticleList 
                    slugInfos={allSlugInfos}
                    lang={lang}
                    dictionary={dictionary}
                    authorSlug={slug}
                    showCount={false}
                  />
                  
                  {hasMore && (
                    <div className="mt-8 text-center">
                      <LoadMoreButton
                        currentPage={currentPage}
                        dictionary={dictionary}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground mb-4">
                    {processTemplate(dictionary.sections.templates.emptyCollection, {
                      items: dictionary.sections.labels.articles,
                      collection: processTemplate(dictionary.sections.templates.itemByAuthor, {
                        item: '',
                        author: author.name
                      })
                    })}
                  </p>
                </div>
              )}
            </Suspense>
          </div>
        </Section>
      </>
    );
    
  } catch (error) {
    console.error('Error rendering author page:', error);
    throw error;
  }
}