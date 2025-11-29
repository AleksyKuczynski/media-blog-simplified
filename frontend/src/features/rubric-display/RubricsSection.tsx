// src/features/rubric-display/RubricsSection.tsx

import Link from 'next/link';
import { Dictionary, Lang } from '@/config/i18n';
import RubricCard from './RubricCard';
import CardGrid from '../layout/CardGrid';
import { RUBRICS_SECTION_STYLES } from './styles';

interface TransformedRubric {
  slug: string;
  name: string;
  description?: string;
  nav_icon?: string;
  url: string;
  articleCount?: number;
}

interface RubricsSectionProps {
  readonly rubrics: TransformedRubric[];
  readonly dictionary: Dictionary;
  readonly lang: Lang;
  readonly heading?: string;
  readonly showViewAll?: boolean;
  readonly className?: string;
}

export default function RubricsSection({
  rubrics,
  dictionary,
  lang,
  heading,
  showViewAll = true,
  className = ''
}: RubricsSectionProps) {
  const defaultHeading = dictionary.sections.home?.exploreRubrics || 'Рубрики';
  const sectionHeading = heading || defaultHeading;
  
  const viewAllText = dictionary.sections.home?.viewAllRubrics || 'Смотреть все рубрики';
  const rubricsUrl = `/${lang}/rubrics`;

  if (rubrics.length === 0) {
    return null;
  }

  return (
    <section className={`${RUBRICS_SECTION_STYLES.section} ${className}`}>
      <div className={RUBRICS_SECTION_STYLES.container}>
        {/* Header */}
        <header className={RUBRICS_SECTION_STYLES.header}>
          <h2 className={RUBRICS_SECTION_STYLES.heading}>
            {sectionHeading}
          </h2>
          
          {dictionary.sections.home?.rubricsDescription && (
            <p className={RUBRICS_SECTION_STYLES.description}>
              {dictionary.sections.home.rubricsDescription}
            </p>
          )}
          
          {showViewAll && (
            <Link 
              href={rubricsUrl}
              className={RUBRICS_SECTION_STYLES.viewAll.link}
              aria-label={`${viewAllText} - посмотреть полный каталог рубрик`}
            >
              {viewAllText}
              <span 
                className={RUBRICS_SECTION_STYLES.viewAll.arrow}
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          )}
        </header>
        
        {/* Grid */}
        <CardGrid
          cols={{
            mobile: 1,
            tablet: 2,
            desktop: 3,
            large: 3
          }}
          className={RUBRICS_SECTION_STYLES.grid}
        >
          {rubrics.map((rubric) => (
            <RubricCard
              key={rubric.slug}
              rubric={rubric}
              lang={lang}
              dictionary={dictionary}
            />
          ))}
        </CardGrid>
      </div>
    </section>
  );
}