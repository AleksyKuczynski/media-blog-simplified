// app/[lang]/[rubric]/[slug]/_components/ArticleSource.tsx

import { Dictionary, Lang } from '@/config/i18n';
import { LAYOUT_STYLES } from './article.styles';

interface ArticleSourceProps {
  externalLink: string | null;
  lang: Lang;
  dictionary: Dictionary;
}

const styles = LAYOUT_STYLES.source;

export function ArticleSource({ externalLink, lang, dictionary }: ArticleSourceProps) {
  if (lang !== 'ru' || !externalLink) return null;

  let displayUrl: string;
  try {
    displayUrl = new URL(externalLink).hostname;
  } catch {
    displayUrl = externalLink;
  }

  return (
    <p className={styles.container}>
      <span className={styles.label}>{dictionary.sections.labels.source}: </span>
      <a
        href={externalLink}
        className={styles.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        {displayUrl}
      </a>
    </p>
  );
}