import { BLOCKS_STYLES } from "../../styles";

// src/main/components/Article/blocks/Blockquote/Type2Blockquote.tsx - SIMPLIFIED
interface Type2Props {
  content: string;
  author: string;
}

export function Type2Blockquote({ content, author }: Type2Props) {
  return (
    <blockquote className={BLOCKS_STYLES.blockquote2.container}>
      <p className={BLOCKS_STYLES.blockquote2.content}>
        {content}
      </p>
      <p className={BLOCKS_STYLES.blockquote2.author}>
        — {author}
      </p>
    </blockquote>
  );
}
