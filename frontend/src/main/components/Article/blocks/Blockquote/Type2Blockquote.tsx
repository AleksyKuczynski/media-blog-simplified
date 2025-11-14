import { BLOCKS_STYLES } from "../../styles";

// src/main/components/Article/blocks/Blockquote/Type2Blockquote.tsx - SIMPLIFIED
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
