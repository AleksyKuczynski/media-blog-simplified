// src/features/article-display/HeroSection.tsx

import { HERO_SECTION_STYLES } from './articles.styles';
import { Dictionary } from '@/config/i18n';

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
  return (
    <div className={HERO_SECTION_STYLES.section}>
      <div className={HERO_SECTION_STYLES.container}>
        <header className={HERO_SECTION_STYLES.header}>
          <h1 className={HERO_SECTION_STYLES.title.base}>
            <span className={HERO_SECTION_STYLES.title.main}>
              {dictionary.sections.home.welcomeTitle.main}
            </span>
            <span className={HERO_SECTION_STYLES.title.sub}>
              {dictionary.sections.home.welcomeTitle.sub}
            </span>
          </h1>
          <p className={HERO_SECTION_STYLES.description}>
            {dictionary.sections.home.welcomeDescription}
          </p>
        </header>
      </div>
    </div>
  );
}