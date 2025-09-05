// src/app/ru/rubrics/page.tsx - Updated with proper dict handling
import { fetchAllRubrics } from '@/main/lib/directus/fetchAllRubrics';
import { RubricCard } from '@/main/components/Main/RubricCard';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import { getDictionary } from '@/main/lib/dictionaries/dictionaries';
import { Rubric } from '@/main/lib/directus/directusInterfaces';
import Section from '@/main/components/Main/Section';
import CardGrid from '@/main/components/Main/CardGrid';

export const dynamic = 'force-dynamic';

export default async function AllRubricsPage() {
  const rubrics = await fetchAllRubrics('ru');
  const dict = await getDictionary('ru');
  
  const breadcrumbItems = [
    { label: dict.sections.rubrics.allRubrics, href: '/ru/rubrics' },
  ];
  
  const rubricBasics = rubrics.map(r => ({
    slug: r.slug,
    name: r.translations.find(t => t.languages_code === 'ru')?.name || r.slug
  }));

  // ✅ ENHANCED: Transform rubrics with icon data and description
  const transformedRubrics = rubrics.map((rubric: Rubric) => {
    const translation = rubric.translations.find(t => t.languages_code === 'ru');
    return {
      slug: rubric.slug,
      name: translation?.name || rubric.slug,
      description: translation?.description || '', // ✅ NEW: Include description
      articleCount: rubric.articleCount,
      nav_icon: rubric.nav_icon,  // ✅ NEW: Include nav_icon
      iconMetadata: rubric.iconMetadata  // ✅ NEW: Include icon metadata
    };
  });

  return (
    <>
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
      
      <Section>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          {dict.sections.rubrics.allRubrics}
        </h1>
        
        <CardGrid>
          {transformedRubrics.map((rubric) => (
            <RubricCard 
              key={rubric.slug} 
              rubric={rubric}
              lang="ru"
              dict={dict}
            />
          ))}
        </CardGrid>
      </Section>
    </>
  );
}