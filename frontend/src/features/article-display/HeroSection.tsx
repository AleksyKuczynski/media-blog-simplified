// src/features/article-display/HeroSection.tsx

import Image from 'next/image';
import { Dictionary } from '@/config/i18n';


// ================================================================
// HERO SECTION STYLES
// ================================================================

export const HERO_SECTION_STYLES = {
  // Section wrapper (applied to Section component)
  section: 'py-16',
  
  // Container
  container: 'container mx-auto px-6',
  
  // Header
  header: 'text-center',
  title: {
    base: 'leading-tight font-bold font-display text-on-sf-var w-fullflex flex-col',
    main:'text-3xl md:text-7xl uppercase',
    dot: 'text-5xl md:text-8xl mb-6 max-w-3xl text-pr-cont',
    sub: 'text-lg md:text-2xl mt-4 text-on-sf-var max-w-3xl mx-auto leading-relaxed',
  },
  description: 'sr-only text-xl text-on-sf-var max-w-3xl mr-0 leading-relaxed',
  image: 'w-full h-auto my-12',

  
  // Loading state
  loading: {
    wrapper: 'text-center py-12',
    spinner: 'animate-spin rounded-full h-12 w-12 border-b-2 border-prcolor mx-auto mb-4',
    text: 'text-on-sf-var',
  },
} as const;

interface HeroSectionProps {
  dictionary: Dictionary;
}

/**
 * Hero section with welcome title and description
 * Future-ready component for design changes
 * Does NOT include articles - those go in a separate Section
 */
export default function HeroSection({
  dictionary
}: HeroSectionProps) {
  const styles = HERO_SECTION_STYLES;
  return (
    <div className={styles.section}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title.base}>
            <span className={styles.title.main}>
              Event
            </span>
            <span className={styles.title.dot}>
              .
            </span>
            <span className={styles.title.main}>
              For
            </span>
            <span className={styles.title.dot}>
              .
            </span>
            <span className={styles.title.main}>
              Me
            </span>
          </h1>
          <p className={styles.title.sub}>
            {dictionary.sections.home.welcomeTitle.sub}
          </p>
          <p className={styles.description}>
            {dictionary.sections.home.welcomeDescription}
          </p>
          <Image
            src="/hero.svg"
            alt="Welcome"
            className={styles.image}
            width={800}
            height={600}
          />

        </header>
      </div>
    </div>
  );
}