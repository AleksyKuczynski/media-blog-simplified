// src/main/components/Article/Metadata.tsx
import Link from 'next/link';
import { Category } from '@/main/lib/directus/directusInterfaces';
import { twMerge } from 'tailwind-merge';

interface MetadataProps {
  categories: Category[];
  // ✅ REMOVED: lang parameter - no longer needed with hardcoded Russian URLs
}

export function Metadata({ categories }: MetadataProps) {
  const containerStyles = twMerge(
    // Base styles
    'text-sm md:text-lg xl:text-xl mb-8 xl:mb-12 text-center space-x-4 md:space-x-8 xl:space-x-12',
    // Theme variants
    'theme-default:text-pr-cont',
    'theme-rounded:text-on-sf-var',
    'theme-sharp:text-on-sf-var'
  );
  
  const linkStyles = twMerge(
    // Base styles
    'hover:text-pr-fix transition-colors duration-200',
    // Theme variants
    'theme-default:underline theme-default:underline-offset-4',
    'theme-rounded:bg-sf-hi theme-rounded:px-3 theme-rounded:py-1 theme-rounded:rounded-lg',
    'theme-sharp:px-2 theme-sharp:border theme-sharp:border-ol theme-sharp:hover:border-pr-fix'
  );
  
  return (
    <div className={containerStyles}>
      {categories.map((category) => (
        <span key={category.slug}>
          <Link 
            href={`/ru/articles?category=${category.slug}`} // ✅ HARDCODED: Static Russian URL instead of /${lang}/articles
            className={linkStyles}
          >
            {category.name}
          </Link>
        </span>
      ))}
    </div>
  );
}