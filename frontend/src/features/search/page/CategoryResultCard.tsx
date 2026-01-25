// src/features/search/page/CategoryResultCard.tsx
import Link from 'next/link';
import { CategorySearchResult } from '@/api/directus';
import { Dictionary, Lang } from '@/config/i18n';

interface CategoryResultCardProps {
  category: CategorySearchResult;
  lang: Lang;
  dictionary: Dictionary;
}

export default function CategoryResultCard({ category, lang, dictionary }: CategoryResultCardProps) {
  return (
    <Link
      href={`/${lang}/articles?category=${category.slug}`}
      className="block p-6 bg-sf rounded-xl hover:bg-sf-hi transition-colors duration-200"
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium uppercase tracking-wide text-on-sf-var opacity-70">
              {dictionary.sections.labels.categories}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-on-sf mb-3">
            {category.name}
          </h3>
          
          <p className="text-sm text-on-sf-var">
            {category.articleCount} {dictionary.common.count.articles}
          </p>
        </div>
      </div>
    </Link>
  );
}