// app/[lang]/[rubric]/[slug]/_components/Header.tsx
/**
 * Article Page - Header Component
 * 
 * Displays article title, hero image, author attribution via AuthorsSection, and metadata.
 * Server component with responsive layout using flex order.
 * 
 * Layout:
 * Mobile (<768px): Date → Title → Image → Lead (flex column with order)
 * Desktop (≥768px): [Image | Title+Date+Authors] → Lead (2-column grid)
 * 
 * Features:
 * - Next.js Image optimization for hero image
 * - AuthorsSection for author cards with avatars (hidden on mobile)
 * - Optional lead paragraph
 * - Publication date display
 * 
 * Dependencies:
 * - article.styles.ts (LAYOUT_STYLES.header)
 * - @/api/directus (DIRECTUS_URL, AuthorDetails)
 * - navigation/AuthorsSection (author cards)
 * 
 * @param title - Article title
 * @param publishedDate - Formatted publication date
 * @param authors - List of article authors
 * @param dictionary - Translations
 * @param imagePath - Optional Directus asset ID
 * @param lead - Optional lead paragraph
 */

import Image from 'next/image';
import { DIRECTUS_URL, AuthorDetails } from '@/api/directus';
import { Dictionary } from '@/config/i18n';
import { LAYOUT_STYLES } from './article.styles';
import { IMAGE_RATIO_STRING } from '@/features/mainConstants';
import AuthorsSection from './navigation/AuthorsSection';

interface HeaderProps {
  title: string;
  publishedDate: string;
  authors: AuthorDetails[];
  dictionary: Dictionary;
  imagePath?: string;
  lead?: string;
}

const styles = LAYOUT_STYLES.header;

export function Header({ 
  title, 
  publishedDate, 
  authors,
  dictionary,
  imagePath,
  lead
}: HeaderProps) {
  return (
    <header className={styles.container}>
      
      {/* Mobile date - order-1, hidden on desktop */}
      <p className={styles.mobileDateText}>{publishedDate}</p>

      {/* Image - order-3 on mobile, order-1 on desktop (left column) */}
      {imagePath && (
        <div className={styles.imageWrapper}>
          <div className={`${styles.imageContainer} ${IMAGE_RATIO_STRING}`}>
            <Image
              src={`${DIRECTUS_URL}/assets/${imagePath}`}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className={styles.image}
            />
          </div>
        </div>
      )}

      {/* Right column: Title + Metadata - order-2 on both mobile and desktop */}
      <div className={styles.rightColumn}>
        <meta itemProp="datePublished" content={publishedDate} />
        <meta itemProp="dateModified" content={publishedDate} />
        
        <h1 
          className={styles.title}
          itemProp="headline"
        >
          {title}
        </h1>
        
        <div className={styles.metadataBox}>
          <AuthorsSection 
            authors={authors}
            dictionary={dictionary}
            className={styles.authorsWrapper}
          />
          <p className={styles.dateText}>{publishedDate}</p>
        </div>
      </div>

      {/* Lead paragraph - order-4, spans full width */}
      {lead && (
        <div className={styles.lead}>
          {lead}
        </div>
      )}
    </header>
  );
}