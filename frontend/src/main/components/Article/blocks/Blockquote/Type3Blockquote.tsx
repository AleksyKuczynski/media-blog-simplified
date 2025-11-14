import { BLOCKS_STYLES } from "../../styles";

// src/main/components/Article/blocks/Blockquote/Type3Blockquote.tsx - SIMPLIFIED
interface Type3Props {
  content: string;
  author: string;
  source: string;
}

const styles = BLOCKS_STYLES.blockquote3;

export function Type3Blockquote({ content, author, source }: Type3Props) {
  return (
    <blockquote className={styles.container}>
      <p className={styles.content}>
        {content}
      </p>
      <p className={styles.author}>
        — {author}
      </p>
      <p className={styles.source}>
        {source}
      </p>
    </blockquote>
  );
}