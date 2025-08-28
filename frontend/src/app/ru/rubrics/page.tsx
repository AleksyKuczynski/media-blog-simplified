// src/app/ru/rubrics/page.tsx - FIX DYNAMIC SERVER USAGE
import { fetchAllRubrics } from '@/main/lib/directus/fetchAllRubrics';
import { RubricCard } from '@/main/components/Main/RubricCard';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import { getDictionary } from '@/main/lib/dictionaries';
import { Rubric } from '@/main/lib/directus/directusInterfaces';
import Section from '@/main/components/Main/Section';
import CardGrid from '@/main/components/Main/CardGrid';

// ✅ FIX: Add dynamic export to prevent static generation
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

  // ✅ FIX: Transform Rubric objects to the format RubricCard expects
  const transformedRubrics = rubrics.map((rubric: Rubric) => ({
    slug: rubric.slug,
    name: rubric.translations.find(t => t.languages_code === 'ru')?.name || rubric.slug,
    articleCount: rubric.articleCount
  }));

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
      <Section 
        title={dict.sections.rubrics.allRubrics}
        ariaLabel={dict.sections.rubrics.allRubrics}
      >
        <CardGrid>
          {transformedRubrics.map((rubric) => (
            <RubricCard 
              key={rubric.slug} 
              rubric={rubric}
              lang="ru"
            />
          ))}
        </CardGrid>
      </Section>
    </>
  );
}