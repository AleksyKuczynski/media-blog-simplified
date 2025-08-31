// src/main/components/Main/RubricCard.tsx - Enhanced with proper Russian text
import Link from "next/link";
import { Dictionary } from '@/main/lib/dictionaries/dictionariesTypes';
import { getRussianArticleCount } from '@/main/lib/dictionaries';

interface RubricCardProps {
  rubric: {
    slug: string;
    name: string;
    articleCount: number;
  };
  lang: string;
  dict: Dictionary; // Add dictionary prop for proper Russian text
}

export function RubricCard({ rubric, lang, dict }: RubricCardProps) {
  // Use proper Russian pluralization for article count
  const articleCountText = getRussianArticleCount(rubric.articleCount);

  return (
    <Link 
      href={`/ru/${rubric.slug}`} 
      className="block group"
      aria-label={`${rubric.name} - ${articleCountText}`}
      title={`Перейти к рубрике "${rubric.name}" (${articleCountText})`}
    >
      <article 
        className="
          h-full bg-sf-cont rounded-2xl border border-ol-var 
          shadow-sm hover:shadow-lg transition-all duration-300
          p-6 hover:scale-105 focus-within:ring-2 focus-within:ring-primary
        "
        itemScope 
        itemType="https://schema.org/Article"
      >
        {/* Enhanced heading with semantic markup */}
        <header>
          <h3 
            className="
              text-lg font-display font-semibold mb-2
              text-on-sf group-hover:text-pr-cont
              transition-colors duration-200
            "
            itemProp="name"
          >
            {rubric.name}
          </h3>
        </header>
        
        {/* Article count with proper Russian text and semantic meaning */}
        <footer 
          className="text-sm text-on-sf-var"
          aria-label={`В рубрике ${rubric.name} ${articleCountText}`}
        >
          <span itemProp="articleBody">
            {articleCountText}
          </span>
        </footer>
        
        {/* Schema.org metadata */}
        <meta itemProp="url" content={`https://event4me.eu/ru/${rubric.slug}`} />
        <meta itemProp="inLanguage" content="ru" />
        <meta itemProp="articleSection" content={rubric.name} />
        <meta itemProp="publisher" content="EventForMe" />
      </article>
    </Link>
  );
}

export default RubricCard;