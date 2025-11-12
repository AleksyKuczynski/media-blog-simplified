import { BLOCKS_STYLES } from "../../styles";

// src/main/components/Article/blocks/Blockquote/Type1Blockquote.tsx
interface Type1Props {
  content: string;
}

export function Type1Blockquote({ content }: Type1Props) {
  return (
    <blockquote className={BLOCKS_STYLES.blockquote1.container}>
      <p className={BLOCKS_STYLES.blockquote1.content}>
        {content}
      </p>
    </blockquote>
  );
}