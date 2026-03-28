// src/features/article-display/HeroSection.tsx

import Image from 'next/image';
import { Dictionary } from '@/config/i18n';
import { EFMHeroImage, EFMTitle } from './HeroSvgs';


// ================================================================
// HERO SECTION STYLES
// ================================================================

export const HERO_SECTION_STYLES = {
  // Section wrapper (applied to Section component)
  section: 'py-16',
  
  // Container
  container: 'container mx-auto px-6',
  
  // Header
  header: 'text-center text-on-sf',
  title: {
    wrapper: 'w-full',
    sub: 'text-lg md:text-2xl mt-4 max-w-3xl mx-auto leading-relaxed',
  },
  image: 'w-full h-auto my-12',  
  description: 'sr-only text-xl max-w-3xl mr-0 leading-relaxed',

  
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
          <div className={styles.title.wrapper}>
            <EFMTitle />
          </div>
          <p className={styles.title.sub}>
            {dictionary.sections.home.welcomeTitle.sub}
          </p>
          <p className={styles.description}>
            {dictionary.sections.home.welcomeDescription}
          </p>
          <div className={styles.image}>
            <EFMHeroImage />
          </div>
        </header>
      </div>
    </div>
  );
}