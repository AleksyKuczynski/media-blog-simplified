// Enhanced /ru/rubrics/page.tsx with complete SEO optimization
import { Metadata } from 'next';
import { fetchAllRubrics } from '@/main/lib/directus/fetchAllRubrics';
import { RubricCard } from '@/main/components/Main/RubricCard';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import { getDictionary } from '@/main/lib/dictionaries/dictionaries';
import { Rubric } from '@/main/lib/directus/directusInterfaces';
import Section from '@/main/components/Main/Section';
import CardGrid from '@/main/components/Main/CardGrid';
import { generateSEOMetadata } from '@/main/components/SEO/SEOManager';
import { StructuredDataManager } from '@/main/components/SEO/StructuredDataManager';

export const dynamic = 'force-dynamic';

// ✅ NEW: Add proper metadata generation for rubrics listing page
export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary('ru');
  
  return generateSEOMetadata({
    dict,
    pageType: 'rubrics-collection' as any, // Extend the type to include this
    pageData: {
      title: dict.seo.titles.rubricsListTitle,
      description: dict.seo.descriptions.rubricsList,
      keywords: dict.seo.keywords.rubricsList,
      path: '/rubrics',
      // Add Open Graph image for social sharing
      imageUrl: 'https://event4me.eu/og-rubrics.jpg'
    }
  });
}

export default async function AllRubricsPage() {
  const [rubrics, dict] = await Promise.all([
    fetchAllRubrics('ru'),
    getDictionary('ru')
  ]);
  
  const breadcrumbItems = [
    { label: dict.sections.rubrics.allRubrics, href: '/ru/rubrics' },
  ];
  
  const rubricBasics = rubrics.map(r => ({
    slug: r.slug,
    name: r.translations.find(t => t.languages_code === 'ru')?.name || r.slug
  }));

  // ✅ ENHANCED: Transform rubrics with complete SEO data for structured data
  const transformedRubrics = rubrics.map((rubric: Rubric) => {
    const translation = rubric.translations.find(t => t.languages_code === 'ru');
    return {
      slug: rubric.slug,
      name: translation?.name || rubric.slug,
      description: translation?.description || `Статьи в рубрике ${translation?.name || rubric.slug}`,
      articleCount: rubric.articleCount,
      nav_icon: rubric.nav_icon,
      iconMetadata: rubric.iconMetadata
    };
  });

  // ✅ NEW: Prepare data for structured data schema
  const structuredDataProps = {
    rubrics: transformedRubrics,
    totalItems: rubrics.length
  };

  return (
    <>
      {/* ✅ NEW: Add structured data for CollectionPage schema */}
      <StructuredDataManager 
        dict={dict}
        pageType="rubrics-collection"
        data={structuredDataProps}
      />
      
      <Breadcrumbs 
        items={breadcrumbItems} 
        rubrics={rubricBasics}
        lang="ru"
        translations={{
          home: dict.navigation.home,
          allRubrics: dict.sections.rubrics.allRubrics,
          allAuthors: dict.sections.authors.ourAuthors,
        }}
      />
      
      {/* ✅ ENHANCED: Semantic HTML structure with proper heading hierarchy */}
      <Section>
        <header className="mb-8 text-center">
          <h1 
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            itemProp="headline"
          >
            {dict.sections.rubrics.allRubrics}
          </h1>
          
          {/* ✅ NEW: Add descriptive text for better SEO and UX */}
          <p 
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            itemProp="description"
          >
            {dict.sections.rubrics.categoriesDescription}
          </p>
          
          {/* ✅ NEW: Add rubrics count for better UX */}
          <p 
            className="text-sm text-gray-500 dark:text-gray-400 mt-2"
            aria-label={`${dict.sections.rubrics.totalRubrics}: ${rubrics.length}`}
          >
            {dict.sections.rubrics.totalRubrics}: <strong>{rubrics.length}</strong>
          </p>
        </header>
        
        {/* ✅ ENHANCED: Semantic main content area */}
        <main 
          role="main" 
          aria-label={dict.sections.rubrics.rubricsCatalog}
          itemScope 
          itemType="https://schema.org/CollectionPage"
        >
          {/* Hidden metadata for SEO */}
          <meta itemProp="name" content={dict.seo.titles.rubricsListTitle} />
          <meta itemProp="description" content={dict.seo.descriptions.rubricsList} />
          <meta itemProp="url" content="https://event4me.eu/ru/rubrics" />
          <meta itemProp="inLanguage" content="ru" />
          
          <CardGrid>
            {transformedRubrics.map((rubric, index) => (
              <div 
                key={rubric.slug}
                itemScope 
                itemType="https://schema.org/Thing"
                itemProp="mainEntity"
                role="article"
                aria-label={`${dict.sections.rubrics.rubricCard}: ${rubric.name}`}
              >
                <RubricCard 
                  rubric={rubric}
                  lang="ru"
                  dict={dict}
                />
                
                {/* ✅ NEW: Additional structured data for each rubric */}
                <meta itemProp="position" content={(index + 1).toString()} />
              </div>
            ))}
          </CardGrid>
          
          {/* ✅ NEW: Additional semantic information */}
          <footer className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {dict.sections.rubrics.browseAllRubrics}
            </p>
          </footer>
        </main>
      </Section>
    </>
  );
}