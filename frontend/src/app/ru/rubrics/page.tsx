// src/app/ru/rubrics/page.tsx - MIGRATED: Uses new SEO components and unified dictionary
import { Metadata } from 'next';
import { fetchAllRubrics } from '@/main/lib/directus/fetchAllRubrics';
import { RubricCard } from '@/main/components/Main/RubricCard';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import { getDictionary as getNewDictionary } from '@/main/lib/dictionary/dictionary';
import { Rubric } from '@/main/lib/directus/directusInterfaces';
import Section from '@/main/components/Main/Section';
import CardGrid from '@/main/components/Main/CardGrid';

// NEW: Import new SEO components
import { generateCollectionMetadata } from '@/main/components/SEO/metadata/CollectionMetadata';
import { CollectionPageSchema } from '@/main/components/SEO/schemas/CollectionPageSchema';
import { getLocalizedRubricCount } from '@/main/lib/dictionary/helpers';

export const dynamic = 'force-dynamic';

/**
 * MIGRATED: Generate metadata using new CollectionMetadata component
 * Replaces old generateSEOMetadata from SEOManager
 */
export async function generateMetadata(): Promise<Metadata> {
  const [rubrics, dictionary] = await Promise.all([
    fetchAllRubrics('ru'),
    getNewDictionary('ru'), // UPDATED: Use new dictionary
  ]);
  
  // Transform rubrics data for metadata generation
  const rubricsData = rubrics.map(rubric => {
    const translation = rubric.translations.find(t => t.languages_code === 'ru');
    return {
      name: translation?.name || rubric.slug,
      slug: rubric.slug,
      description: translation?.description,
    };
  });

  // UPDATED: Use new CollectionMetadata component
  return await generateCollectionMetadata({
    dictionary,
    collectionType: 'rubrics',
    collectionData: {
      totalCount: rubrics.length,
      featured: rubricsData.slice(0, 6), // First 6 as featured
      path: '/ru/rubrics',
      // Use dictionary for custom text
      customTitle: dictionary.sections.rubrics.collectionPageTitle,
      customDescription: dictionary.sections.rubrics.collectionPageDescription,
    },
  });
}

export default async function AllRubricsPage() {
  const [rubrics, dictionary] = await Promise.all([
    fetchAllRubrics('ru'),
    getNewDictionary('ru'), // UPDATED: Use new unified dictionary
  ]);
  
  // UPDATED: Use new dictionary structure
  const breadcrumbItems = [
    { label: dictionary.sections.rubrics.allRubrics, href: '/ru/rubrics' },
  ];
  
  // Transform rubrics for RubricCard component
  const transformedRubrics = rubrics.map((rubric: Rubric) => {
    const translation = rubric.translations.find(t => t.languages_code === 'ru');
    return {
      slug: rubric.slug,
      name: translation?.name || rubric.slug,
      description: translation?.description,
      articleCount: rubric.article_count || 0,
      nav_icon: rubric.nav_icon,
      iconMetadata: rubric.iconMetadata,
    };
  });

  // Prepare data for CollectionPageSchema
  const schemaItems = transformedRubrics.map(rubric => ({
    name: rubric.name,
    slug: rubric.slug,
    description: rubric.description,
    url: `/ru/${rubric.slug}`,
    articleCount: rubric.articleCount,
    icon: rubric.nav_icon,
  }));

  // UPDATED: Use existing pluralization helper instead of creating new function
  const totalRubricsText = pluralizeRussian(
    rubrics.length, 
    dictionary.common.rubrics
  );

  return (
    <>
      {/* NEW: Use CollectionPageSchema instead of StructuredDataManager */}
      <CollectionPageSchema
        dictionary={dictionary}
        collectionType="rubrics"
        items={schemaItems}
        totalCount={rubrics.length}
        currentPath="/ru/rubrics"
      />
      
      {/* UPDATED: Use new dictionary structure for breadcrumbs */}
      <Breadcrumbs 
        items={breadcrumbItems} 
        rubrics={[]} // No need for rubric basics on rubrics page
        lang="ru"
        translations={{
          home: dictionary.navigation.labels.home,
          allRubrics: dictionary.sections.rubrics.allRubrics,
          allAuthors: dictionary.sections.authors.ourAuthors,
        }}
      />
      
      {/* Page header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          {dictionary.sections.rubrics.allRubrics}
        </h1>
        
        {/* Page description */}
        <p className="text-lg text-on-sf-var mb-4 max-w-3xl">
          {dictionary.sections.rubrics.collectionPageDescription}
        </p>
        
        {/* Rubrics count */}
        <p className="text-sm text-muted-foreground">
          {dictionary.sections.rubrics.totalRubrics}: {totalRubricsText}
        </p>
      </header>

      {/* Main content section */}
      <Section 
        isOdd={true}
        ariaLabel={dictionary.sections.rubrics.rubricsCatalog}
      >
        {rubrics.length > 0 ? (
          <CardGrid>
            {transformedRubrics.map((rubric) => (
              <RubricCard 
                key={rubric.slug}
                rubric={rubric}
                dictionary={dictionary} // UPDATED: Pass unified dictionary
              />
            ))}
          </CardGrid>
        ) : (
          /* No rubrics state */
          <div className="text-center py-12">
            <p className="text-lg text-on-sf-var mb-4">
              {dictionary.sections.rubrics.noRubricsAvailable}
            </p>
            <p className="text-sm text-muted-foreground">
              {dictionary.sections.rubrics.checkBackLater}
            </p>
          </div>
        )}
      </Section>
      
      {/* Additional sections could go here */}
      {rubrics.length > 0 && (
        <Section 
          isOdd={false}
          ariaLabel={dictionary.sections.rubrics.categoriesDescription}
        >
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              {dictionary.sections.rubrics.browseAllRubrics}
            </h2>
            <p className="text-on-sf-var">
              {dictionary.sections.rubrics.categoriesDescription}
            </p>
          </div>
        </Section>
      )}
    </>
  );
}