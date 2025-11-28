// src/app/[lang]/[rubric]/[slug]/_components/content/Type4Blockquote.tsx
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