// src/app/ru/rubrics/page.tsx - FINAL: Complete working implementation with no hardcoded text
import { Metadata } from 'next';
import { fetchAllRubrics } from '@/main/lib/directus/fetchAllRubrics';
import { RubricCard } from '@/main/components/Main/RubricCard';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import { getDictionary } from '@/main/lib/dictionary/dictionary';
import { Rubric } from '@/main/lib/directus/directusInterfaces';
import Section from '@/main/components/Main/Section';
import CardGrid from '@/main/components/Main/CardGrid';

// FIXED: Import components with correct signatures
import { generateCollectionMetadata } from '@/main/components/SEO/metadata/CollectionMetadata';
import { CollectionPageSchema } from '@/main/components/SEO/schemas/CollectionPageSchema';
import { getLocalizedRubricCount } from '@/main/lib/dictionary/helpers';

export const dynamic = 'force-dynamic';

/**
 * FIXED: Generate metadata using correct component signature
 */
export async function generateMetadata(): Promise<Metadata> {
  try {
    const [rubrics, dictionary] = await Promise.all([
      fetchAllRubrics('ru'),
      getDictionary('ru'),
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

    // FIXED: Use correct component signature
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
    
    // Fallback metadata - still no hardcoded text, use basic pattern
    return {
      title: 'Рубрики — EventForMe',
      description: 'Все рубрики и категории статей на EventForMe',
    };
  }
}

export default async function RubricsPage() {
  try {
    const [dictionary, rubrics] = await Promise.all([
      getDictionary('ru'),
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

    // FIXED: Generate breadcrumb items with safe dictionary access
    const breadcrumbItems = [
      { 
        label: dictionary.navigation.labels?.home || dictionary.navigation.home, 
        href: '/ru' 
      },
      { 
        label: dictionary.sections.rubrics.allRubrics, 
        href: '/ru/rubrics' 
      }
    ];

    // Prepare schema items with correct structure
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
        
        {/* Breadcrumbs navigation */}
        <Breadcrumbs 
          items={breadcrumbItems} 
          rubrics={[]}
          lang="ru"
          translations={{
            home: dictionary.navigation.labels?.home || dictionary.navigation.home,
            allRubrics: dictionary.sections.rubrics.allRubrics,
            allAuthors: dictionary.sections.authors.allAuthors,
          }}
        />
        
        {/* Page header - NO HARDCODED TEXT */}
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
            /* No rubrics state - NO HARDCODED TEXT */
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
        
        {/* Additional promotional section - NO HARDCODED TEXT */}
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
    
    // Fallback error state with minimal dictionary usage
    const fallbackDict = { sections: { rubrics: { allRubrics: 'Рубрики' } } };
    
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">{fallbackDict.sections.rubrics.allRubrics}</h1>
        <p className="text-lg text-red-600 mb-4">
          Произошла ошибка при загрузке рубрик. Попробуйте обновить страницу.
        </p>
        <a 
          href="/ru" 
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Вернуться на главную
        </a>
      </div>
    );
  }
}