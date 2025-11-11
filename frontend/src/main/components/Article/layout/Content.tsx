// SIMPLEST FIX: Content.tsx - Remove prose classes since components manage their own styling
import { ContentChunk, TocItem } from '@/main/lib/markdown/markdownTypes';
import { ArticleContentRenderer } from '../content';

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
    <article className="pb-12">
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      <ArticleContentRenderer chunks={chunks} />
    </article>
  );
}