// src/main/components/Article/Metadata.tsx - ADD SAFETY CHECK
import Link from 'next/link';
import { AuthorDetails } from '@/main/lib/directus/directusInterfaces';
import { Lang } from '@/main/lib/dictionary/types';
import { LAYOUT_STYLES } from '../styles';

interface MetadataProps {
  publishedDate: string;
  authors: AuthorDetails[];
  lang: Lang;
  editorialText: string;
}

export function Metadata({ publishedDate, authors, lang, editorialText }: MetadataProps) {
  // ✅ SAFETY CHECK: Ensure authors is always an array
  const safeAuthors = authors || [];
  
  return (
    <div className={LAYOUT_STYLES.metadata.container}>
      <p>{publishedDate}</p>
      <p>
        {safeAuthors.length > 0 && safeAuthors[0].name !== '::EDITORIAL::' ? (
          safeAuthors.map((author, index) => (
            <span key={author.slug}>
              {index > 0 && ", "}
              <Link 
                href={`/${lang}/authors/${author.slug}`} 
                className={LAYOUT_STYLES.metadata.authorLink}
              >
                {author.name}
              </Link>
            </span>
          ))
        ) : (
          <span>{editorialText}</span>
        )}
      </p>
    </div>
  );
}