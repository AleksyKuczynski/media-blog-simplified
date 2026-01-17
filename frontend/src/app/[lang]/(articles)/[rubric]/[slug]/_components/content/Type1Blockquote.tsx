// app/[lang]/[rubric]/[slug]/_components/content/Type1Blockquote.tsx
/**
 * Article Content - Type 1 Blockquote Component
 * 
 * Standard blockquote variant with default styling.
 * First of four blockquote types for content variety.
 * 
 * Visual Style:
 * - Left border accent
 * - Subtle background
 * - Italic text
 * - Increased padding
 * 
 * Usage: General quotes, pull quotes, emphasis
 * 
 * Dependencies:
 * - ../article.styles (BLOCKS_STYLES.blockquote.type1)
 * 
 * @param content - HTML content string
 */

import { BLOCKS_STYLES } from "../article.styles";

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