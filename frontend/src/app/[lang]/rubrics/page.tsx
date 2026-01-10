// src/app/[lang]/rubrics/page.tsx

import { Metadata } from 'next';
import Breadcrumbs from '@/features/navigation/Breadcrumbs/Breadcrumbs';
import Section from '@/features/layout/Section';
import CardGrid from '@/features/layout/CardGrid';
import { generateCollectionMetadata } from '@/shared/seo/metadata/CollectionMetadata';
import { CollectionPageSchema } from '@/shared/seo/schemas/CollectionPageSchema';
import { getLocalizedRubricCount } from '@/config/i18n/helpers/content';
import { getDictionary, Lang } from '@/config/i18n';
import { Rubric, fetchAllRubrics } from '@/api/directus';
import { createErrorHandler } from '@/shared/errors/lib/errorUtils';
import RubricCard from '@/features/rubric-display/RubricCard';
import RandomArticlesSection from '@/features/article-display/RandomArticlesSection';

// ISR CONFIGURATION: 1 hour (rubrics list is structural)
export const revalidate = 3600;

/**
 * Generate metadata using clean new dictionary system
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = getDictionary(lang);

  try {
    const [rubrics] = await Promise.all([
      fetchAllRubrics(lang),
    ]);
    
    // Transform rubrics data for metadata generation
    const rubricsData = rubrics.map((rubric: Rubric) => {
    const translation = rubric.translations?.find(t => t.languages_code === lang);
    return {
      ...rubric,
      name: translation?.name || rubric.slug,
      description: translation?.description || '',
      icon: rubric.nav_icon,
      url: `/${lang}/${rubric.slug}`,
    };
  });

    // Clean metadata generation
    return await generateCollectionMetadata({
      dictionary,
      collectionType: 'rubrics',
      items: rubricsData,
      totalCount: rubrics.length,
      currentPath: `/${lang}/rubrics`,
      featured: false,
    });
    
  } catch (error) {
    console.error('Error generating rubrics metadata:', error);
    
    // Use errorHandler instead of hardcoded fallback
    const errorHandler = createErrorHandler(dictionary);
    return errorHandler.generateErrorMetadata('page');
  }
}

export default async function RubricsPage({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const dictionary = getDictionary(lang);

  try {
    const [rubrics] = await Promise.all([
      fetchAllRubrics(lang),
    ]);

    // Transform rubrics for rendering
    const transformedRubrics = rubrics.map((rubric: Rubric) => {
      const translation = rubric.translations?.find(t => t.languages_code === lang);
      return {
        ...rubric,
        name: translation?.name || rubric.slug,
        description: translation?.description,
        url: `/${lang}/${rubric.slug}`,
      };
    });

    // Transform rubrics for schema
    const schemaItems = transformedRubrics.map(rubric => ({
      name: rubric.name,
      slug: rubric.slug,
      url: `${dictionary.seo.site.url}/${lang}/${rubric.slug}`,
      description: rubric.description,
      articleCount: rubric.articleCount || 0,
    }));

    // Breadcrumb generation using dictionary
    const breadcrumbItems = [
      {
        label: dictionary.navigation.labels.home,
        href: `/${lang}`,
      },
      {
        label: dictionary.navigation.labels.rubrics,
        href: `/${lang}/rubrics`,
      },
    ];

    return (
      <>
        <CollectionPageSchema
          dictionary={dictionary}
          collectionType="rubrics"
          items={schemaItems}
          totalCount={rubrics.length}
          currentPath={`/${lang}/rubrics`}
          featured={false}
        />
        
        <Breadcrumbs 
          items={breadcrumbItems} 
          rubrics={[]}
          lang={lang}
          translations={{
            home: dictionary.navigation.labels.home,
            allRubrics: dictionary.navigation.labels.rubrics,
            allAuthors: dictionary.navigation.labels.authors,
          }}
        />
        
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {dictionary.sections.rubrics.allRubrics}
          </h1>
          
          <p className="text-lg text-on-sf-var mb-4 max-w-3xl">
            {dictionary.sections.rubrics.categoriesDescription}
          </p>
          
          <p className="text-sm text-muted-foreground">
            {getLocalizedRubricCount(dictionary, rubrics.length)}
          </p>
        </header>

        <Section 
          ariaLabel={dictionary.sections.rubrics.rubricsCatalog}
        >
          {transformedRubrics.length > 0 ? (
            <CardGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {transformedRubrics.map((rubric) => (
                <RubricCard
                  key={rubric.slug}
                  rubric={rubric}
                  lang={lang}
                  dictionary={dictionary}
                />
              ))}
            </CardGrid>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">
                {dictionary.sections.rubrics.noRubricsAvailable}
              </p>
              <p className="text-sm text-muted-foreground">
                {dictionary.sections.rubrics.checkBackLater}
              </p>
            </div>
          )}
        </Section>

        {/* Random Articles Section */}
        <Section
          title={dictionary.sections.rubrics.readMoreAbout}
          titleLevel="h2"
          variant="tertiary"
          hasNextSectionTitle={true}
        >
          <RandomArticlesSection
            lang={lang}
            dictionary={dictionary}
            limit={6}
          />
        </Section>
      </>
    );
    
  } catch (error) {
    console.error('Error rendering rubrics page:', error);
    
    throw error;
  }
}