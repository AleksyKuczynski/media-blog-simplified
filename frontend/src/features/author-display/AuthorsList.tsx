// src/features/author-display/AuthorsList.tsx
import { fetchAllAuthors } from '@/api/directus';
import { getDictionary, Lang } from '@/config/i18n';
import AuthorCard from './AuthorCard';
import { AUTHORS_GRID_STYLES } from './author.styles';

interface AuthorsListProps {
  lang: Lang;
  roleFilter: 'author' | 'illustrator';
  emptyMessage: string;
}

export async function AuthorsList({ lang, roleFilter, emptyMessage }: AuthorsListProps) {
  const dictionary = getDictionary(lang);
  const authors = await fetchAllAuthors(lang, roleFilter);
  
  if (authors.length === 0) {
    return (
      <p className="text-center text-gray-600 dark:text-gray-400">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className={AUTHORS_GRID_STYLES}>
      {authors.map((author) => (
        <AuthorCard 
          key={author.slug}
          author={author}
          lang={lang}
          dictionary={dictionary}
        />
      ))}
    </div>
  );
}