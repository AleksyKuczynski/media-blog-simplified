// frontend/src/app/preview/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { getDictionary, Lang } from '@/config/i18n';
import { fetchFullArticle, fetchRubricBasics } from '@/api/directus';
import { processContent } from '@/app/[lang]/(articles)/[rubric]/[slug]/_components/markdown/processContent';
import { Header } from '@/app/[lang]/(articles)/[rubric]/[slug]/_components/Header';
import ArticleContentRenderer from '@/app/[lang]/(articles)/[rubric]/[slug]/_components/content/ArticleContentRenderer';
import { TableOfContents } from '@/app/[lang]/(articles)/[rubric]/[slug]/_components/navigation/TableOfContents';
import { LAYOUT_STYLES } from '@/app/[lang]/(articles)/[rubric]/[slug]/_components/article.styles';
import Collapsible from '@/shared/ui/Collapsible';
import PreviewTabs from './_components/PreviewTabs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function resolvePreviewArticle(slug: string): Promise<{
  langs: Lang[];
  articleSlug: string;
} | null> {
  const DIRECTUS_URL = process.env.DIRECTUS_URL;
  if (!DIRECTUS_URL) return null;

  try {
    const filter = encodeURIComponent(
      JSON.stringify({ slug: { _eq: slug }, status: { _in: ['published', 'draft'] } })
    );
    const url = `${DIRECTUS_URL}/items/articles?filter=${filter}&fields=slug,translations.languages_code&limit=1`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;

    const data = await res.json();
    const article = data.data?.[0];
    if (!article) return null;

    const langs = ((article.translations ?? []).map((t: any) => t.languages_code) as Lang[])
      .filter(Boolean);
    if (langs.length === 0) return null;

    return { langs, articleSlug: slug };
  } catch {
    return null;
  }
}

async function buildTabContent(articleSlug: string, lang: Lang) {
  const dictionary = getDictionary(lang);
  const article = await fetchFullArticle(articleSlug, lang, true);
  if (!article) return null;

  const translation = article.translations[0];
  if (!translation) return null;

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

  const { chunks: contentChunks, toc: tocItems } = await processContent(rawContent, lang);

  return {
    lang,
    content: (
      <article className={LAYOUT_STYLES.articleContainer}>
        <Header
          title={translation.title || '[No title]'}
          lead={translation.lead}
          imagePath={article.article_heading_img}
          authors={article.authorsWithDetails}
          illustrator={article.illustratorWithDetails}
          publishedDate={formattedDate}
          dictionary={dictionary}
          lang={lang}
        />
        {article.toc && tocItems.length > 0 && (
          <Collapsible
            title={dictionary.content.labels.tableOfContents}
            ariaLabel={dictionary.content.labels.tableOfContents}
          >
            <TableOfContents items={tocItems} />
          </Collapsible>
        )}
        <ArticleContentRenderer chunks={contentChunks} lang={lang} />
      </article>
    ),
  };
}

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const resolved = await resolvePreviewArticle(slug);
    if (!resolved) notFound();

    const { langs, articleSlug } = resolved;

    const tabResults = await Promise.all(langs.map(lang => buildTabContent(articleSlug, lang)));
    const tabs = tabResults.filter(Boolean) as NonNullable<Awaited<ReturnType<typeof buildTabContent>>>[];

    if (tabs.length === 0) notFound();

    return <PreviewTabs tabs={tabs} />;

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? (error.stack ?? '') : '';
    return (
      <div style={{
        padding: '2rem',
        fontFamily: 'monospace',
        background: '#fff0f0',
        color: '#900',
        margin: '1rem',
        borderRadius: '8px',
        border: '2px solid #f99',
      }}>
        <h2 style={{ marginTop: 0 }}>⚠️ Preview render error</h2>
        <p><strong>Slug:</strong> {slug}</p>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{message}</pre>
        <details>
          <summary style={{ cursor: 'pointer' }}>Stack trace</summary>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8em', opacity: 0.7 }}>{stack}</pre>
        </details>
      </div>
    );
  }
}