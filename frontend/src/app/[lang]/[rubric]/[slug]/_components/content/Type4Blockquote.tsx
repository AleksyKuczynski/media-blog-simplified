// app/[lang]/[rubric]/[slug]/_components/content/Type4Blockquote.tsx

import { BLOCKS_STYLES } from '../article.styles';
import { getDictionary, Lang } from '@/config/i18n';

interface Type4Props {
  content: string;
  lang: Lang;
}

const styles = BLOCKS_STYLES.blockquote4;

export function Type4Blockquote({ content, lang }: Type4Props) {
  const dictionary = getDictionary(lang);
  
  return (
    <blockquote className={styles.container}>
      <div className={styles.label}>
        {dictionary.content.labels.portalAdvice}
      </div>
      <div className={styles.content}>
        {content.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </blockquote>
  );
}