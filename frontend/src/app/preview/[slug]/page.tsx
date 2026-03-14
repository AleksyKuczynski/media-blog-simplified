// frontend/src/app/preview/[slug]/page.tsx
//
// Renders draft and published articles directly — no redirect to the ISR-cached
// article page. This avoids two fundamental issues:
//   1. SameSite=Lax cookies are blocked in cross-site iframes (Directus preview)
//   2. Next.js ISR ignores query params, so ?preview=true never busts the cache
//
// This page is force-dynamic and always fetches fresh from Directus.

import { notFound } from 'next/navigation';
import { getDictionary, Lang } from '@/config/i18n';
import { fetchFullArticle, fetchRubricBasics, resolveArticleSlug } from '@/api/directus';
import { processContent } from '@/app/[lang]/(articles)/[rubric]/[slug]/_components/markdown/processContent';
import { Header } from '@/app/[lang]/(articles)/[rubric]/[slug]/_components/Header';
import ArticleContentRenderer from '@/app/[lang]/(articles)/[rubric]/[slug]/_components/content/ArticleContentRenderer';
import PreviewBanner from '@/app/[lang]/(articles)/[rubric]/[slug]/_components/PreviewBanner';
import { TableOfContents } from '@/app/[lang]/(articles)/[rubric]/[slug]/_components/navigation/TableOfContents';
import { LAYOUT_STYLES } from '@/app/[lang]/(articles)/[rubric]/[slug]/_components/article.styles';
import Collapsible from '@/shared/ui/Collapsible';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function resolvePreviewArticle(slug: string): Promise<{
  lang: Lang;
  rubricSlug: string;
  articleSlug: string;
} | null> {
  const DIRECTUS_URL = process.env.DIRECTUS_URL;
  if (!DIRECTUS_URL) return null;

  try {
    const filter = encodeURIComponent(
      JSON.stringify({ slug: { _eq: slug }, status: { _in: ['published', 'draft'] } })
    );
    const url = `${DIRECTUS_URL}/items/articles?filter=${filter}&fields=slug,rubric_slug,translations.languages_code&limit=1`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;

    const data = await res.json();
    const article = data.data?.[0];
    if (!article) return null;

    const rubricSlug = article.rubric_slug?.slug ?? article.rubric_slug;
    if (!rubricSlug) return null;

    const langs: string[] = (article.translations ?? []).map((t: any) => t.languages_code);
    const lang = (langs.includes('ru') ? 'ru' : langs.includes('en') ? 'en' : langs[0]) as Lang;
    if (!lang) return null;

    return { lang, rubricSlug, articleSlug: slug };
  } catch {
    return null;
  }
}

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const resolved = await resolvePreviewArticle(slug);
  if (!resolved) {
    notFound();
  }

  const { lang, rubricSlug, articleSlug } = resolved;
  const dictionary = getDictionary(lang);

  const [article, rubricBasics] = await Promise.all([
    fetchFullArticle(articleSlug, lang, true), // includesDrafts = true
    fetchRubricBasics(lang),
  ]);

  if (!article) {
    notFound();
  }

  const translation = article.translations[0];
  if (!translation) {
    notFound();
  }

  const publishedDate = article.published_at ? new Date(article.published_at) : null;
  const formattedDate = publishedDate
    ? publishedDate.toLocaleDateString(dictionary.locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const rawContent = translation.article_body
    ?.map((block: any) => block.item?.content || '')
    .join('\n\n') || '';

  const processedContent = await processContent(rawContent, lang);
  const { chunks: contentChunks, toc: tocItems } = processedContent;

  const rubricDetails = rubricBasics.find(r => r.slug === rubricSlug);
  const rubricName = rubricDetails?.name || rubricSlug;

  return (
    <>
      <PreviewBanner />

      <article className={LAYOUT_STYLES.articleContainer}>
        <Header
          title={translation.title || '[No title]'}
          lead={translation.lead}
          imagePath={article.article_heading_img}
          authors={article.authorsWithDetails}
          illustrator={article.illustratorWithDetails}
          publishedDate={formattedDate}
          dictionary={dictionary}
        />

        {article.toc && tocItems.length > 0 && (
          <Collapsible
            title={dictionary.content.labels.tableOfContents}
            ariaLabel={dictionary.content.labels.tableOfContents}
          >
            <TableOfContents items={tocItems} />
          </Collapsible>
        )}

        <ArticleContentRenderer
          chunks={contentChunks}
          lang={lang}
        />
      </article>
    </>
  );
}