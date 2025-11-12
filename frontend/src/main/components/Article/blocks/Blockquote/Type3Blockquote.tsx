import { BLOCKS_STYLES } from "../../styles";

// src/main/components/Article/blocks/Blockquote/Type3Blockquote.tsx - SIMPLIFIED
interface Type3Props {
  content: string;
  author: string;
  source: string;
}

export function Type3Blockquote({ content, author, source }: Type3Props) {
  return (
    <blockquote className={BLOCKS_STYLES.blockquote3.container}>
      <p className={BLOCKS_STYLES.blockquote3.content}>
        {content}
      </p>
      <p className={BLOCKS_STYLES.blockquote3.author}>
        — {author}
      </p>
      <p className={BLOCKS_STYLES.blockquote3.source}>
        {source}
      </p>
    </blockquote>
  );
}