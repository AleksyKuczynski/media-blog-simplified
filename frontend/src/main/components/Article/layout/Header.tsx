// src/main/components/Article/Header.tsx - SIMPLIFIED
import Image from 'next/image';
import Link from 'next/link';
import { DIRECTUS_URL, AuthorDetails } from '@/main/lib/directus';
import { IMAGE_RATIO_STRING } from '../../mainConstants';

interface HeaderProps {
  title: string;
  publishedDate: string;
  authors: AuthorDetails[];
  editorialText: string;
  imagePath?: string;
  lead?: string;
}

export function Header({ 
  title, 
  publishedDate, 
  authors, 
  editorialText, 
  imagePath,
  lead
}: HeaderProps) {
  return (
    <header className="relative mb-12 lg:grid grid-cols-2 justify-center">
      
      <h1 className="mb-8 lg:pl-6 xl:pl-8 font-display text-3xl text-center lg:text-left font-bold text-on-sf">
        {title}
      </h1>
      
      {imagePath && (
        <div className={`relative mx-auto ${IMAGE_RATIO_STRING} overflow-hidden order-first h-full w-full md:max-lg:w-3/4 rounded-t-2xl lg:rounded-2xl`}>
          <Image
            src={`${DIRECTUS_URL}/assets/${imagePath}`}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="font-medium text-sm xl:text-base text-on-sf-var mx-auto flex justify-between col-span-2 w-full lg:max-w-[800px] lg:py-6 xl:py-8 bg-sf-cont md:max-lg:w-3/4 rounded-b-2xl lg:rounded-2xl lg:mt-8 p-6 shadow-sm">
        <p>{publishedDate}</p>
        <p>
          {authors.length > 0 && authors[0].name !== '::EDITORIAL::' ? (
            authors.map((author, index) => (
              <span key={author.slug}>
                {index > 0 && ", "}
                <Link 
                  href={`/ru/authors/${author.slug}`} 
                  className="text-pr-cont hover:text-pr-fix underline underline-offset-4 transition-colors duration-600"
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

      {lead && (
        <div className="text-lg xl:text-xl font-light max-w-[800px] mx-auto mb-8 col-span-2 pt-6 text-on-sf">
          {lead}
        </div>
      )}
    </header>
  );
}