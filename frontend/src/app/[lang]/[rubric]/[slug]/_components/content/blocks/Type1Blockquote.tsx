// src/app/[lang]/[rubric]/[slug]/_components/content/blocks/Type1Blockquote.tsx
import { BLOCKS_STYLES } from "../../article.styles";

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