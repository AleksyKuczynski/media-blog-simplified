// app/[lang]/[rubric]/[slug]/_components/Metadata.tsx
/**
 * Article Page - Metadata Component
 * 
 * Displays article metadata (author, date) in header.
 * Server component with author linking.
 * 
 * Features:
 * - Author name(s) with links
 * - Publication date display
 * - Multiple author handling (comma-separated)
 * - Editorial fallback text
 * 
 * Layout:
 * - Horizontal flex layout
 * - Author(s) on left
 * - Date on right
 * - Responsive spacing
 * 
 * Author Handling:
 * - Multiple authors: "Author1, Author2 & Author3"
 * - Single author: "Author Name"
 * - No authors: "Editorial Team" (editorialText)
 * 
 * Dependencies:
 * - ../article.styles (LAYOUT_STYLES.metadata)
 * - @/main/lib/directus (AuthorDetails)
 * - @/main/lib/dictionary (Lang)
 * 
 * NOTE: Usually integrated into Header.tsx,
 * separated for cleaner component structure
 * 
 * @param authors - Array of author objects with name, slug
 * @param publishedDate - Formatted publication date string
 * @param editorialText - Fallback text when no authors
 * @param lang - Language code for author links
 */

import Link from 'next/link';
import { AuthorDetails } from '@/main/lib/directus/directusInterfaces';
import { Lang } from '@/main/lib/dictionary';
import { LAYOUT_STYLES } from './article.styles';

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