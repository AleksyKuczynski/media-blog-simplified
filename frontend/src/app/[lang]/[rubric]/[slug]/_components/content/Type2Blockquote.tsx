// src/app/[lang]/[rubric]/[slug]/_components/content/Type2Blockquote.tsx

import { BLOCKS_STYLES } from "../article.styles";

interface Type2Props {
  content: string;
  author: string;
}

const styles = BLOCKS_STYLES.blockquote2;

export function Type2Blockquote({ content, author }: Type2Props) {
  return (
    <blockquote className={styles.container}>
      <p className={styles.content}>
        {content}
      </p>
      <p className={styles.author}>
        — {author}
      </p>
    </blockquote>
  );
}
