// app/[lang]/[rubric]/[slug]/_components/Header.tsx
/**
 * Article Page - Header Component
 * 
 * Displays article title, hero image, author attribution via AuthorsSection, and metadata.
 * Server component with responsive layout (mobile stacked, desktop grid).
 * 
 * Features:
 * - Next.js Image optimization for hero image
 * - AuthorsSection for author cards with avatars
 * - Optional lead paragraph
 * - Publication date display
 * 
 * Dependencies:
 * - article.styles.ts (LAYOUT_STYLES.header)
 * - @/api/directus (DIRECTUS_URL, AuthorDetails)
 * - navigation/AuthorsSection (author cards)
 * 
 * @param lang - Language code for author links
 * @param title - Article title
 * @param publishedDate - Formatted publication date
 * @param authors - List of article authors
 * @param dictionary - Translations
 * @param imagePath - Optional Directus asset ID
 * @param lead - Optional lead paragraph
 */

import Image from 'next/image';
import { DIRECTUS_URL, AuthorDetails } from '@/api/directus';
import { Lang, Dictionary } from '@/config/i18n';
import { LAYOUT_STYLES } from './article.styles';
import { IMAGE_RATIO_STRING } from '@/features/mainConstants';
import AuthorsSection from './navigation/AuthorsSection';

interface HeaderProps {
  lang: Lang;
  title: string;
  publishedDate: string;
  authors: AuthorDetails[];
  dictionary: Dictionary;
  imagePath?: string;
  lead?: string;
}

const styles = LAYOUT_STYLES.header;

export function Header({ 
  lang,
  title, 
  publishedDate, 
  authors,
  dictionary,
  imagePath,
  lead
}: HeaderProps) {
  return (
    <header className={styles.container}>
      
      <div className={styles.metadataBox}>
        <AuthorsSection 
          authors={authors}
          dictionary={dictionary}
          className={styles.authorsWrapper}
        />
        <p className={styles.dateText}>{publishedDate}</p>
      </div>

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

      {lead && (
        <div className={styles.lead}>
          {lead}
        </div>
      )}
    </header>
  );
}