import { getDictionary, Lang } from '@/config/i18n';
import HeroArticles from '@/features/article-display/HeroArticles';
import HeroSection from '@/features/article-display/HeroSection';
import AuthorsCarouselSection from '@/features/author-display/AuthorsCarouselSection';
import RubricsCarouselSection from '@/features/rubric-display/RubricsCarouselSection';
import HomePageSchema from '@/shared/seo/schemas/HomePageSchema';

// Remove fetchHeroSlugs import and all Promise.all fetching

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const dictionary = getDictionary(lang as Lang);

  return (
    <>
      <HomePageSchema
        dictionary={dictionary}
        lang={lang}
        currentPath={`/${lang}`}
      />

      <HeroSection dictionary={dictionary} />

      <HeroArticles 
        lang={lang} 
        dictionary={dictionary}
      />

      <RubricsCarouselSection
        lang={lang}
        dictionary={dictionary}
        title={dictionary.sections.home.featuredRubrics}
        variant="primary"
        limit={6}
      />

      <AuthorsCarouselSection
        lang={lang}
        dictionary={dictionary}
        title={dictionary.sections.authors.ourAuthors}
        variant="tertiary"
        limit={4}
      />
    </>
  );
}