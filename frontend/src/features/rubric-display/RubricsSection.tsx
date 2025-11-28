// src/main/components/Main/RubricsSection.tsx
// Reusable rubrics section - extracted from HomePage
// Displays grid of rubric cards with optional heading

import Link from 'next/link';
import { Dictionary, Lang } from '@/config/i18n';
import RubricCard from './RubricCard';
import CardGrid from '../layout/CardGrid';

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

/**
 * RubricsSection - Reusable rubrics display component
 * 
 * Features:
 * - Grid of rubric cards
 * - Optional custom heading
 * - Optional "View All" link
 * - Responsive layout
 * 
 * Usage:
 * - HomePage: Show 6 rubrics with "Explore Rubrics" heading
 * - Search page: Show 6 rubrics with "Browse Categories" heading
 * - Can be used anywhere rubrics grid is needed
 */
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
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <header className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-on-sf">
            {sectionHeading}
          </h2>
          
          {dictionary.sections.home?.rubricsDescription && (
            <p className="text-lg text-on-sf-var max-w-2xl mx-auto mb-8">
              {dictionary.sections.home.rubricsDescription}
            </p>
          )}
          
          {showViewAll && (
            <Link 
              href={rubricsUrl}
              className="
                inline-flex items-center gap-2 
                text-pr-cont hover:text-pr-fix 
                font-medium transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-pr-cont focus:ring-offset-2 rounded
                group
              "
              aria-label={`${viewAllText} - посмотреть полный каталог рубрик`}
            >
              {viewAllText}
              <span 
                className="transform transition-transform duration-200 group-hover:translate-x-1" 
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          )}
        </header>
        
        {/* Rubrics Grid */}
        <CardGrid
          cols={{
            mobile: 1,
            tablet: 2,
            desktop: 3,
            large: 3
          }}
          className="max-w-7xl mx-auto"
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