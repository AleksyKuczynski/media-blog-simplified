// src/main/components/Article/blocks/Blockquote/Type4Blockquote.tsx - SIMPLIFIED
import Image from 'next/image';
import { BLOCKS_STYLES } from '../../styles';

interface Type4Props {
  content: string;
  author: string;
  avatarUrl: string;
}

export function Type4Blockquote({ content, author, avatarUrl }: Type4Props) {  
  return (
    <blockquote className={BLOCKS_STYLES.blockquote4.container}>
      
      {avatarUrl && (
        <div className={BLOCKS_STYLES.blockquote4.avatarWrapper}>
          <Image 
            src={avatarUrl}
            alt=""
            width={80}
            height={80}
            className={BLOCKS_STYLES.blockquote4.avatar}
          />
        </div>
      )}
      
      <p className={BLOCKS_STYLES.blockquote4.authorName}>
        {author}
      </p>
      
      <div className={BLOCKS_STYLES.blockquote4.content}>
        {content.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </blockquote>
  );
}