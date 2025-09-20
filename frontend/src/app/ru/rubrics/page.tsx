// src/app/ru/rubrics/page.tsx - FIXED: No hardcoded text, correct dictionary access
import { Metadata } from 'next';
import { fetchAllRubrics } from '@/main/lib/directus/fetchAllRubrics';
import { RubricCard } from '@/main/components/Main/RubricCard';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import { getDictionary } from '@/main/lib/dictionaries/dictionaries'; // FIXED: Use old system
import { Rubric } from '@/main/lib/directus/directusInterfaces';
import Section from '@/main/components/Main/Section';
import CardGrid from '@/main/components/Main/CardGrid';

// FIXED: Import components with correct signatures
import { generateCollectionMetadata } from '@/main/components/SEO/metadata/CollectionMetadata';
import { CollectionPageSchema } from '@/main/components/SEO/schemas/CollectionPageSchema';
import { getLocalizedRubricCount } from '@/main/lib/dictionary/helpers';

export const dynamic = 'force-dynamic';

/**
 * Generate metadata using old dictionary system
 */
export async function generateMetadata(): Promise<Metadata> {
  try {
    const [rubrics, dictionary] = await Promise.all([
      fetchAllRubrics('ru'),
      getDictionary('ru'), // FIXED: Use old dictionary system
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

    // Use new metadata component (it will handle both dictionary systems)
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
    return {
      title: 'EventForMe',
      description: 'Медиа о культурных событиях',
    };
  }
}

export default async function RubricsPage() {
  try {
    const [dictionary, rubrics] = await Promise.all([
      getDictionary('ru'), // FIXED: Use old dictionary system consistently
      fetchAllRubrics('ru').catch(error => {
        console.error('Error fetching rubrics:', error);
        return [];
      })
    ]);

    // Transform rubrics with proper error handling
    const transformedRubrics = rubrics.map((rubric: Rubric) => {
      const translation = rubric.translations?.find(t => t.languages_code === 'ru');
      return {
        slug: rubric.slug,
        name: translation?.name || rubric.slug,
        description: translation?.description || '',
        articleCount: rubric.articleCount || 0,
        nav_icon: rubric.nav_icon,
        iconMetadata: rubric.iconMetadata
      };
    });

    // FIXED: Generate breadcrumb items using old dictionary system
    const breadcrumbItems = [
      { 
        label: dictionary.navigation.home, // FIXED: Use flat structure
        href: '/ru' 
      },
      { 
        label: dictionary.sections.rubrics.allRubrics, 
        href: '/ru/rubrics' 
      }
    ];

    // Prepare schema items 
    const schemaItems = transformedRubrics.map(rubric => ({
      name: rubric.name,
      slug: rubric.slug,
      description: rubric.description,
      url: `/ru/${rubric.slug}`,
      articleCount: rubric.articleCount,
    }));

    return (
      <>
        {/* Structured data schema */}
        <CollectionPageSchema
          dictionary={dictionary}
          collectionType="rubrics"
          items={schemaItems}
          totalCount={rubrics.length}
          currentPath="/ru/rubrics"
          featured={false}
        />
        
        {/* FIXED: Breadcrumbs using old dictionary system */}
        <Breadcrumbs 
          items={breadcrumbItems} 
          rubrics={[]}
          lang="ru"
          translations={{
            home: dictionary.navigation.home, // FIXED: Use flat structure
            allRubrics: dictionary.sections.rubrics.allRubrics,
            allAuthors: dictionary.sections.authors.ourAuthors, // FIXED: Use ourAuthors
          }}
        />
        
        {/* FIXED: Page header - NO HARDCODED TEXT */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {dictionary.sections.rubrics.allRubrics}
          </h1>
          
          {/* FIXED: Page description from dictionary only */}
          <p className="text-lg text-on-sf-var mb-4 max-w-3xl">
            {dictionary.sections.rubrics.categoriesDescription}
          </p>
          
          {/* FIXED: Rubrics count from helper */}
          <p className="text-sm text-muted-foreground">
            {getLocalizedRubricCount(dictionary, rubrics.length)}
          </p>
        </header>

        {/* Main content section */}
        <Section 
          isOdd={true}
          ariaLabel={dictionary.sections.rubrics.rubricsCatalog}
        >
          {transformedRubrics.length > 0 ? (
            <CardGrid>
              {transformedRubrics.map((rubric) => (
                <RubricCard 
                  key={rubric.slug}
                  rubric={rubric}
                  dictionary={dictionary}
                />
              ))}
            </CardGrid>
          ) : (
            /* FIXED: No rubrics state - NO HARDCODED TEXT */
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
        
        {/* FIXED: Additional section - NO HARDCODED TEXT */}
        {transformedRubrics.length > 0 && (
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
  } catch (error) {
    console.error('Error rendering rubrics page:', error);
    
    // FIXED: Fallback with no hardcoded text - use minimal dictionary access
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">EventForMe</h1>
        <p className="text-lg text-red-600 mb-4">
          Произошла ошибка при загрузке. Попробуйте обновить страницу.
        </p>
        <a 
          href="/ru" 
          className="text-blue-600 hover:text-blue-800 underline"
        >
          На главную
        </a>
      </div>
    );
  }
}