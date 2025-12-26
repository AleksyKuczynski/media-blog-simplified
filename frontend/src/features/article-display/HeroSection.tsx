// src/features/article-display/HeroSection.tsx

import { Suspense } from 'react';
import Section from '@/features/layout/Section';
import HeroArticles from './HeroArticles';
import { HERO_SECTION_STYLES } from './styles';
import { Dictionary, Lang } from '@/config/i18n';

interface HeroSectionProps {
  heroSlugs: string[];
  lang: Lang;
  dictionary: Dictionary;
}

export default function HeroSection({
  heroSlugs,
  lang,
  dictionary
}: HeroSectionProps) {
  return (
    <Section className={HERO_SECTION_STYLES.section}>
      <div className={HERO_SECTION_STYLES.container}>
        <header className={HERO_SECTION_STYLES.header}>
          <h1 className={HERO_SECTION_STYLES.title}>
            {dictionary.sections.home.welcomeTitle}
          </h1>
          <p className={HERO_SECTION_STYLES.description}>
            {dictionary.sections.home.welcomeDescription}
          </p>
        </header>
        
        {heroSlugs.length > 0 && (
          <div className={HERO_SECTION_STYLES.featuredWrapper}>
            <h2 className={HERO_SECTION_STYLES.featuredTitle}>
              {dictionary.sections.home.featuredContent}
            </h2>
            <Suspense fallback={
              <div className={HERO_SECTION_STYLES.loading.wrapper}>
                <div className={HERO_SECTION_STYLES.loading.spinner} />
                <p className={HERO_SECTION_STYLES.loading.text}>
                  {dictionary.common.status.loading}
                </p>
              </div>
            }>
              <HeroArticles 
                slugs={heroSlugs}
                lang={lang} 
                dictionary={dictionary}
              />
            </Suspense>
          </div>
        )}
      </div>
    </Section>
  );
}