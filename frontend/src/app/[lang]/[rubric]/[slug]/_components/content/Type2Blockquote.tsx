// app/[lang]/[rubric]/[slug]/_components/content/Type2Blockquote.tsx
/**
 * Article Content - Type 2 Blockquote Component
 * 
 * Alternative blockquote variant with distinct styling.
 * Second of four blockquote types for content variety.
 * 
 * Visual Style:
 * - Different accent color
 * - Alternate background shade
 * - Distinct border treatment
 * - Varied typography
 * 
 * Usage: Secondary quotes, contrasting emphasis
 * 
 * Dependencies:
 * - ../article.styles (BLOCKS_STYLES.blockquote.type2)
 * 
 * @param content - HTML content string
 */

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
