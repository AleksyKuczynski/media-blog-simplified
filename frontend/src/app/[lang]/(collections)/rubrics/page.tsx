// src/app/[lang]/(collections)/rubrics/page.tsx

import { Metadata } from 'next';
import Section from '@/features/layout/Section';
import { generateCollectionMetadata } from '@/shared/seo/metadata/CollectionMetadata';
import { CollectionPageSchema } from '@/shared/seo/schemas/CollectionPageSchema';
import { getDictionary, Lang } from '@/config/i18n';
import { Rubric, fetchAllRubrics } from '@/api/directus';
import { createErrorHandler } from '@/shared/errors/lib/errorUtils';
import RubricCard from '@/features/rubric-display/RubricCard';
import RandomArticlesSection from '@/features/article-display/RandomArticlesSection';
import CollectionDescription from '@/features/layout/CollectionDescription';
import PageError from '@/shared/errors/PageError';
import EmptyState from '@/shared/ui/EmptyState';
import { RUBRICS_GRID_STYLES } from '@/features/rubric-display/styles';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = getDictionary(lang);

  try {
    const rubrics = await fetchAllRubrics(lang);
    
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
    const rubrics = await fetchAllRubrics(lang);

    const transformedRubrics = rubrics.map((rubric: Rubric) => {
      const translation = rubric.translations?.find(t => t.languages_code === lang);
      return {
        ...rubric,
        name: translation?.name || rubric.slug,
        description: translation?.description,
        url: `/${lang}/${rubric.slug}`,
      };
    });

    const schemaItems = transformedRubrics.map(rubric => ({
      name: rubric.name,
      slug: rubric.slug,
      url: `${dictionary.seo.site.url}/${lang}/${rubric.slug}`,
      description: rubric.description,
      articleCount: rubric.articleCount || 0,
    }));

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
        
        <Section 
          title={dictionary.sections.rubrics.allRubrics}
          titleLevel="h1"
          ariaLabel={dictionary.sections.rubrics.rubricsCatalog}
          hasNextSectionTitle={true}
        >
          <CollectionDescription>
            {dictionary.sections.rubrics.categoriesDescription}
          </CollectionDescription>

          {transformedRubrics.length > 0 ? (
            <div className={RUBRICS_GRID_STYLES}>
              {transformedRubrics.map((rubric) => (
                <RubricCard
                  key={rubric.slug}
                  rubric={rubric}
                  lang={lang}
                  dictionary={dictionary}
                />
              ))}
            </div>
          ) : (
            <EmptyState message={dictionary.sections.rubrics.noRubricsAvailable} />
          )}
        </Section>

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
    
    return (
      <Section>
        <PageError 
          dictionary={dictionary}
          contentType="rubric"
          backHref={`/${lang}`}
        />
      </Section>
    );
  }
}