// src/app/ru/rubrics/page.tsx
// FIXED: Complete rubrics page with correct imports and proper implementation

import { Metadata } from 'next';
import { fetchAllRubrics } from '@/main/lib/directus/fetchAllRubrics';
import { RubricCard } from '@/main/components/Main/RubricCard';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import Section from '@/main/components/Main/Section';
import CardGrid from '@/main/components/Main/CardGrid';

// FIXED: Import clean SEO components with correct paths
import { generateCollectionMetadata } from '@/main/components/SEO/metadata/CollectionMetadata';
import { CollectionPageSchema } from '@/main/components/SEO/schemas/CollectionPageSchema';
import { getLocalizedRubricCount } from '@/main/lib/dictionary/helpers/content'; // FIXED: Correct import
import getDictionary from '@/main/lib/dictionary/getDictionary';

export const dynamic = 'force-dynamic';

/**
 * Generate metadata using clean new dictionary system
 */
export async function generateMetadata(): Promise<Metadata> {
  try {
    const [rubrics, dictionary] = await Promise.all([
      fetchAllRubrics('ru'),
      getDictionary('ru'), // FIXED: Consistent dictionary usage
    ]);
    
    // Transform rubrics data for metadata generation
    const rubricsData = rubrics.map(rubric => {
      const translation = rubric.translations?.find(t => t.languages_code === 'ru');
      return {
        name: translation?.name || rubric.slug,
        slug: rubric.slug,
        description: translation?.description,
      };
    });

    // Clean metadata generation
    return await generateCollectionMetadata({
      dictionary,
      collectionType: 'rubrics',
      items: rubricsData,
      totalCount: rubrics.length,
      currentPath: '/ru/rubrics',
      featured: false,
    });
    
  } catch (error) {
    console.error('Error generating rubrics metadata:', error);
    
    // Fallback metadata using basic structure
    return {
      title: 'Рубрики — EventForMe',
      description: 'Изучите наши тематические рубрики о культурных событиях и современном искусстве.',
    };
  }
}

export default async function RubricsPage() {
  try {
    const [rubrics, dictionary] = await Promise.all([
      fetchAllRubrics('ru'),
      getDictionary('ru'), // FIXED: Direct dictionary usage
    ]);

    // Transform rubrics for rendering
    const transformedRubrics = rubrics.map(rubric => {
      const translation = rubric.translations?.find(t => t.languages_code === 'ru');
      return {
        ...rubric,
        name: translation?.name || rubric.slug,
        description: translation?.description,
        url: `/ru/${rubric.slug}`,
      };
    });

    // Transform rubrics for schema
    const schemaItems = transformedRubrics.map(rubric => ({
      name: rubric.name,
      slug: rubric.slug,
      url: `${dictionary.seo.site.url}/ru/${rubric.slug}`,
      description: rubric.description,
      articleCount: rubric.articleCount || 0,
    }));

    // Clean breadcrumb generation using dictionary
    const breadcrumbItems = [
      {
        label: dictionary.navigation.labels.home,
        href: '/ru',
      },
      {
        label: dictionary.navigation.labels.rubrics,
        href: '/ru/rubrics',
      },
    ];

    return (
      <>
        <CollectionPageSchema
          dictionary={dictionary}
          collectionType="rubrics"
          items={schemaItems}
          totalCount={rubrics.length}
          currentPath="/ru/rubrics"
          featured={false}
        />
        
        <Breadcrumbs 
          items={breadcrumbItems} 
          rubrics={[]}
          lang="ru"
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
          isOdd={true}
          ariaLabel={dictionary.sections.rubrics.rubricsCatalog}
        >
          {transformedRubrics.length > 0 ? (
            <CardGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {transformedRubrics.map((rubric) => (
                <RubricCard
                  key={rubric.slug}
                  rubric={rubric}
                  lang="ru"
                  dictionary={dictionary} // Pass complete dictionary
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
      </>
    );
    
  } catch (error) {
    console.error('Error rendering rubrics page:', error);
    
    // FIXED: Clean error fallback using dictionary structure
    // Note: We can't access dictionary here in catch block, so use basic Russian text
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Ошибка</h1>
        <p className="text-lg text-muted-foreground">
          Произошла ошибка при загрузке рубрик. Попробуйте обновить страницу.
        </p>
      </div>
    );
  }
}