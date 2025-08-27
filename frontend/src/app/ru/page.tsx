// src/app/[lang]/(main)/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Lang } from '@/main/lib/dictionaries/dictionariesTypes';
import { getDictionary } from '@/main/lib/dictionaries';
import { fetchAllRubrics, Rubric, fetchHeroSlugs } from '@/main/lib/directus/index';
import HeroArticles from '@/main/components/Main/HeroArticles';
import RubricCard from '@/main/components/Main/RubricCard';
import Section from '@/main/components/Main/Section';
import CardGrid from '@/main/components/Main/CardGrid';

interface HomeProps {
  params: { lang: Lang };
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params: { lang } }: { params: { lang: Lang } }): Promise<Metadata> {
  const dict = await getDictionary(lang);
  return {
    title: dict.sections.home.welcomeTitle,
    description: dict.sections.home.welcomeDescription,
  };
}

export default async function Home({ params: { lang } }: HomeProps) {
  const [dict, heroSlugs, rubrics] = await Promise.all([
    getDictionary(lang),
    fetchHeroSlugs(lang).catch(error => {
      console.error('Error fetching hero articles:', error);
      return [];
    }),
    fetchAllRubrics(lang).catch(error => {
      console.error('Error fetching rubrics:', error);
      return [];
    })
  ]);

  return (
    <>
      <Section isOdd={true}>
        <h1 className="text-4xl md:text-6xl font-bold text-prcolor mb-4 text-center">
          {dict.sections.home.welcomeTitle}
        </h1>
        <p className="text-xl text-accolor text-center mb-8">
          {dict.sections.home.welcomeDescription}
        </p>
      </Section>

      <Section 
        ariaLabel={dict.sections.articles.featuredArticles}
      >
        <Suspense fallback={<div>{dict.common.loading}</div>}>
          {heroSlugs.length > 0 ? (
            <HeroArticles heroSlugs={heroSlugs} lang={lang} />
          ) : (
            <div>{dict.sections.articles.noFeaturedArticles}</div>
          )}
        </Suspense>
      </Section>

      <Section 
        isOdd={true}
        ariaLabel={dict.sections.home.exploreRubrics}
        title={dict.sections.home.exploreRubrics}
      >
        <CardGrid>
          {rubrics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rubrics.slice(0, 6).map((rubric) => {
                return <RubricCard key={rubric.slug} rubric={rubric} lang={lang} />;
              })}
            </div>
          ) : (
            <p className="text-center text-txcolor-secondary">No rubrics available</p>
          )}
          {rubrics.length > 6 && (
            <div className="text-center mt-8">
              <Link href={`/${lang}/rubrics`} className="text-prcolor hover:text-prcolor-dark transition-colors duration-200">
                {dict.sections.home.viewAllRubrics}
              </Link>
            </div>
          )}
        </CardGrid>
      </Section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "http://schema.org",
          "@type": "WebPage",
          "name": dict.sections.home.welcomeTitle,
          "description": dict.sections.home.welcomeDescription,
          "publisher": {
            "@type": "Organization",
            "name": "My Blog"
          }
        })
      }} />
    </>
  );
}