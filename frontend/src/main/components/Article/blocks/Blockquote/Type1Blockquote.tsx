import { BLOCKS_STYLES } from "../../styles";

// src/main/components/Article/blocks/Blockquote/Type1Blockquote.tsx
interface Type1Props {
  content: string;
}

const styles = BLOCKS_STYLES.blockquote1;

export function Type1Blockquote({ content }: Type1Props) {
  return (
    <blockquote className={styles.container}>
      <p className={styles.content}>
        {content}
      </p>
    </blockquote>
  );
}