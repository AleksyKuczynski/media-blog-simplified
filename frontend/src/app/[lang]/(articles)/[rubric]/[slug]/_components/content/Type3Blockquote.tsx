// app/[lang]/[rubric]/[slug]/_components/content/Type3Blockquote.tsx
/**
 * Article Content - Type 3 Blockquote Component
 * 
 * Third blockquote variant with unique styling.
 * Part of four-type system for visual diversity.
 * 
 * Visual Style:
 * - Tertiary accent color
 * - Alternative background treatment
 * - Unique border style
 * - Distinctive spacing
 * 
 * Usage: Tertiary quotes, special callouts
 * 
 * Dependencies:
 * - ../article.styles (BLOCKS_STYLES.blockquote.type3)
 * 
 * @param content - HTML content string
 */

import { BLOCKS_STYLES } from "../article.styles";

interface Type3Props {
  content: string;
  author: string;
  source?: string;
}

const styles = BLOCKS_STYLES.blockquote3;

export function Type3Blockquote({ content, author, source }: Type3Props) {
  const lines = content.split('\n').filter(line => line.trim() !== '');

  return (
    <blockquote className={styles.container}>
      <p className={styles.content}>
        {lines.map((line, index) => (
          <span key={index}>
            {line}
            {index < lines.length - 1 && <br />}
          </span>
        ))}
      </p>
      <footer className={styles.footer}>
        <cite className={styles.cite}>
          <span className={styles.author}>— {author}</span>
          {source && <span className={styles.source}>{source}</span>}
        </cite>
      </footer>
    </blockquote>
  );
}