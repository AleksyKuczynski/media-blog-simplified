// src/app/ru/rubrics/page.tsx
import { fetchAllRubrics } from '@/main/lib/directus/fetchAllRubrics';
import RubricCard from '@/main/components/Main/RubricCard';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import { getDictionary } from '@/main/lib/dictionaries';
import { Rubric } from '@/main/lib/directus/directusInterfaces';
import Section from '@/main/components/Main/Section';
import CardGrid from '@/main/components/Main/CardGrid';

// ✅ REMOVED: AllRubricsPageProps interface - no longer need lang parameter

export default async function AllRubricsPage() {
  // ✅ REMOVED: params parameter - use hardcoded Russian
  const rubrics = await fetchAllRubrics('ru'); // ✅ HARDCODED: Russian language
  const dict = await getDictionary('ru'); // ✅ HARDCODED: Russian language
  
  const breadcrumbItems = [
    { label: dict.sections.rubrics.allRubrics, href: '/ru/rubrics' }, // ✅ HARDCODED: Static Russian URL
  ];
  
  const rubricBasics = rubrics.map(r => ({
    slug: r.slug,
    name: r.translations.find(t => t.languages_code === 'ru')?.name || r.slug // ✅ HARDCODED: Russian language
  }));

  return (
    <>
      <Breadcrumbs 
        items={breadcrumbItems} 
        rubrics={rubricBasics}
        lang="ru" // ✅ HARDCODED: Russian language
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
          {rubrics.map((rubric: Rubric) => (
            <RubricCard 
              key={rubric.slug} 
              rubric={rubric}
              lang="ru" // ✅ HARDCODED: Russian language
            />
          ))}
        </CardGrid>
      </Section>
    </>
  );
}