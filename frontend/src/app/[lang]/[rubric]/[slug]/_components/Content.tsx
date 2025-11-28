// src/app/[lang]/[rubric]/[slug]/_components/Content.tsx
import { ContentChunk, TocItem } from '@/app/[lang]/[rubric]/[slug]/_components/markdown/markdownTypes';
import { LAYOUT_STYLES } from './article.styles';
import ArticleContentRenderer from './content/ArticleContentRenderer';

interface ContentProps {
  chunks: ContentChunk[];
  toc: TocItem[];
  title?: string;
  author?: string;
  datePublished?: string;
}

export function Content({ chunks, toc, title, author, datePublished }: ContentProps) {
  const structuredData = title && author && datePublished ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "author": {
      "@type": "Person",
      "name": author
    },
    "datePublished": datePublished,
  } : null;

  return (
    <article className={LAYOUT_STYLES.content.container}>
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      <ArticleContentRenderer chunks={chunks} />
    </article>
  );
}