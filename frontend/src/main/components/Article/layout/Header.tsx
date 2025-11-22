// src/main/components/Article/Header.tsx - SIMPLIFIED
import Image from 'next/image';
import Link from 'next/link';
import { DIRECTUS_URL, AuthorDetails } from '@/main/lib/directus';
import { IMAGE_RATIO_STRING } from '../../mainConstants';
import { LAYOUT_STYLES } from '../styles';
import { Lang } from '@/main/lib/dictionary';

interface HeaderProps {
  lang: Lang;
  title: string;
  publishedDate: string;
  authors: AuthorDetails[];
  editorialText: string;
  imagePath?: string;
  lead?: string;
}

const styles = LAYOUT_STYLES.header;

export function Header({ 
  lang,
  title, 
  publishedDate, 
  authors, 
  editorialText, 
  imagePath,
  lead
}: HeaderProps) {
  return (
    <header className={styles.container}>
      
      <h1 className={styles.title}>
        {title}
      </h1>
      
      {imagePath && (
        <div className={`${styles.imageContainer} ${IMAGE_RATIO_STRING}`}>
          <Image
            src={`${DIRECTUS_URL}/assets/${imagePath}`}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
            className={styles.image}
          />
        </div>
      )}

      <div className={styles.metadataBox}>
        <p>
          {authors.length > 0 && authors[0].name !== '::EDITORIAL::' ? (
            authors.map((author, index) => (
              <span key={author.slug}>
                {index > 0 && " & "}
                <Link 
                  href={`/${lang}/authors/${author.slug}`} 
                  className={styles.authorLink}
                >
                  {author.name}
                </Link>
              </span>
            ))
          ) : (
            <span>{editorialText}</span>
          )}
        </p>
        <p>{publishedDate}</p>
      </div>

      {lead && (
        <div className={styles.lead}>
          {lead}
        </div>
      )}
    </header>
  );
}