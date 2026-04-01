// app/[lang]/[rubric]/[slug]/_components/content/Type5Blockquote.tsx

import { BLOCKS_STYLES } from '../article.styles';
import { getDictionary, Lang } from '@/config/i18n';
import { convertMarkdownToHtmlSync } from '../markdown/markdownToHtml';

interface Type5Props {
  content: string;
  lang: Lang;
}

const styles = BLOCKS_STYLES.blockquote5;

export function Type5Blockquote({ content, lang }: Type5Props) {
  const dictionary = getDictionary(lang);

  return (
    <blockquote className={styles.container}>
      <h2 className={styles.label}>
        {dictionary.content.labels.portalAdvice}
      </h2>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: convertMarkdownToHtmlSync(content) }}
      />
    </blockquote>
  );
}