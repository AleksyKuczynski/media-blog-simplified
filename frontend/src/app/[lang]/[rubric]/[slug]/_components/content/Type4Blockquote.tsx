// app/[lang]/[rubric]/[slug]/_components/content/Type4Blockquote.tsx
/**
 * Article Content - Type 4 Blockquote Component
 * 
 * Fourth blockquote variant completing the set.
 * Provides maximum visual variety in content.
 * 
 * Visual Style:
 * - Quaternary accent color
 * - Final alternate background
 * - Distinct visual treatment
 * - Unique typography style
 * 
 * Usage: Special emphasis, final quote variant
 * 
 * Dependencies:
 * - ../article.styles (BLOCKS_STYLES.blockquote.type4)
 * 
 * NOTE: Four-type system prevents visual repetition
 * in articles with multiple blockquotes
 * 
 * @param content - HTML content string
 */

import Image from 'next/image';
import { BLOCKS_STYLES } from '../article.styles';

interface Type4Props {
  content: string;
  author: string;
  avatarUrl: string;
}

const styles = BLOCKS_STYLES.blockquote4;

export function Type4Blockquote({ content, author, avatarUrl }: Type4Props) {  
  return (
    <blockquote className={styles.container}>
      
      {avatarUrl && (
        <div className={styles.avatarWrapper}>
          <Image 
            src={avatarUrl}
            alt=""
            width={80}
            height={80}
            className={styles.avatar}
          />
        </div>
      )}
      
      <p className={styles.authorName}>
        {author}
      </p>
      
      <div className={styles.content}>
        {content.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </blockquote>
  );
}