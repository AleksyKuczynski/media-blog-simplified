// src/features/article-display/HeroSection.tsx

import Image from 'next/image';
import { Dictionary } from '@/config/i18n';
import { EFMHeroImage, EFMTitle } from './HeroSvgs';
import { cn } from '@/lib/utils';


// ================================================================
// HERO SECTION STYLES
// ================================================================

export const HERO_SECTION_STYLES = {
  // Section wrapper (applied to Section component)
  section: 'py-16',
  
  // Container
  container: 'container mx-auto px-6 lg:px-3',
  
  // Header
  header: cn(
    'max-lg:text-center text-on-sf',
    'lg:grid lg:grid-cols-2',
  ),
  title: {
    wrapper: 'w-full',
    sub: cn(
      'text-lg sm:text-xl xl:text-2xl leading-relaxed',
      'max-w-3xl mx-auto my-8 sm:my-12 lg:my-16 lg:pr-8 xl:pr-12'
    ),
  },
  image: 'w-full h-auto my-12 sm:my-16',  
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

            <p className={styles.title.sub}>
              {dictionary.sections.home.welcomeTitle.sub}
            </p>
          </div>
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