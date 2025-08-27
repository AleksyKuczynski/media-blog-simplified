// src/main/components/Article/Metadata.tsx
import Link from 'next/link';
import { AuthorDetails } from '@/main/lib/directus/directusInterfaces';
import { Lang } from '@/main/lib/dictionaries/dictionariesTypes';

interface MetadataProps {
  publishedDate: string;
  authors: AuthorDetails[];
  lang: Lang;
  editorialText: string;
}

export function Metadata({ publishedDate, authors, lang, editorialText }: MetadataProps) {
  return (
    <div className="
      font-medium text-sm xl:text-base text-on-sf-var 
      mx-auto flex justify-between col-span-2 
      w-full lg:max-w-[800px] lg:py-6 xl:py-8
      bg-sf-cont md:max-lg:w-3/4 rounded-b-2xl lg:rounded-2xl 
      lg:mt-8 p-6 shadow-sm
    ">
      <p>{publishedDate}</p>
      <p>
        {authors.length > 0 && authors[0].name !== '::EDITORIAL::' ? (
          authors.map((author, index) => (
            <span key={author.slug}>
              {index > 0 && ", "}
              <Link 
                href={`/ru/authors/${author.slug}`} 
                className="
                  text-pr-cont hover:text-pr-fix 
                  underline underline-offset-4 
                  transition-colors duration-600
                "
              >
                {author.name}
              </Link>
            </span>
          ))
        ) : (
          <span>{editorialText}</span>
        )}
      </p>
    </div>
  );
}