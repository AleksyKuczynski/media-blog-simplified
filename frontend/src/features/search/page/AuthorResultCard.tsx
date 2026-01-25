// src/features/search/page/AuthorResultCard.tsx
import Link from 'next/link';
import { AuthorSearchResult } from '@/api/directus';
import { Dictionary, Lang } from '@/config/i18n';

interface AuthorResultCardProps {
  author: AuthorSearchResult;
  lang: Lang;
  dictionary: Dictionary;
}

export default function AuthorResultCard({ author, lang, dictionary }: AuthorResultCardProps) {
  return (
    <Link
      href={`/${lang}/authors/${author.slug}`}
      className="block p-6 bg-sf rounded-xl hover:bg-sf-hi transition-colors duration-200"
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium uppercase tracking-wide text-on-sf-var opacity-70">
              {dictionary.sections.labels.author}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-on-sf mb-2">
            {author.name}
          </h3>
          
          {author.bio && (
            <p className="text-on-sf-var line-clamp-2 mb-3">
              {author.bio}
            </p>
          )}
          
          <p className="text-sm text-on-sf-var">
            {author.articleCount} {dictionary.common.count.articles}
          </p>
        </div>
      </div>
    </Link>
  );
}