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
 * - @/api/directus (DIRECTUS_URL, ArticleAuthor)
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
import { DIRECTUS_ASSETS_URL, ArticleAuthor } from '@/api/directus';
import { Dictionary, Lang } from '@/config/i18n';
import { LAYOUT_STYLES } from './article.styles';
import { IMAGE_RATIO_STRING } from '@/features/mainConstants';
import AuthorsSection from './navigation/AuthorsSection';
import Link from 'next/link';

interface HeaderProps {
  title: string;
  publishedDate: string;
  authors: ArticleAuthor[];
  lang: Lang;
  dictionary: Dictionary;
  imagePath?: string;
  lead?: string;
  illustrator?: ArticleAuthor;
  imageSource?: string;
}

const styles = LAYOUT_STYLES.header;

export function Header({ 
  title, 
  publishedDate, 
  authors,
  lang,
  dictionary,
  imagePath,
  lead,
  illustrator,
  imageSource,
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
              src={`${DIRECTUS_ASSETS_URL}/assets/${imagePath}`}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className={styles.image}
            />
          </div>

          {/* Image source / Illustrator credit */}
          {imagePath && (imageSource || illustrator) && (
            <p className={styles.illustratorCredit}>
              {imageSource ? (
                <span>{imageSource}</span>
              ) : (
                <>
                  <span className={styles.illustratorLabel}>
                    {dictionary.sections.labels.illustratedBy}:{' '}
                  </span>
                  <Link 
                    href={`/${lang}/authors/${illustrator!.slug}`}
                    className={styles.illustratorLink}
                  >
                    {illustrator!.name}
                  </Link>
                </>
              )}
            </p>
          )}
        </div>
      )}

      {/* Right column: Title + Metadata - order-2 on both mobile and desktop */}
      <div className={styles.rightColumn}>
        <p className={styles.dateText}>{publishedDate}</p>
        <h1 
          className={styles.title}
          itemProp="headline"
        >
          {title}
        </h1>
        
        <div className={styles.metadataBox}>
          <AuthorsSection 
            authors={authors}
            lang={lang}
            dictionary={dictionary}
            className={styles.authorsWrapper}
          />
        </div>
      </div>

      {/* Lead paragraph - order-4, spans full width */}
      {lead && (
        <div className={styles.lead}>
          {lead}
        </div>
      )}

      <meta itemProp="datePublished" content={publishedDate} />
      <meta itemProp="dateModified" content={publishedDate} />
      
      {imagePath && (
        <meta itemProp="image" content={`${DIRECTUS_ASSETS_URL}/assets/${imagePath}`} />
      )}
      
      <div className={styles.metadata}>
        <time 
          dateTime={publishedDate} 
          className={styles.mobileDateText}
          itemProp="datePublished"
        >
          {publishedDate}
        </time>
        
        {authors.map((author) => (
          <span 
            key={author.slug} 
            itemProp="author" 
            itemScope 
            itemType="https://schema.org/Person"
          >
            <meta itemProp="name" content={author.name} />
            <link itemProp="url" href={`${baseUrl}/${lang}/authors/${author.slug}`} />
          </span>
        ))}

        {/* Add illustrator to schema */}
        {illustrator && (
          <span 
            itemProp="contributor" 
            itemScope 
            itemType="https://schema.org/Person"
          >
            <meta itemProp="name" content={illustrator.name} />
            <meta itemProp="url" content={`${baseUrl}/${lang}/authors/${illustrator.slug}`} />
            <meta itemProp="jobTitle" content="Illustrator" />
          </span>
        )}
      </div>

    </header>
  );
}