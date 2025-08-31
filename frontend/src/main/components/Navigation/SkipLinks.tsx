// src/main/components/Navigation/SkipLinks.tsx - Accessibility Skip Links
import { NavigationTranslations, SearchTranslations } from "@/main/lib/dictionaries/dictionariesTypes";

interface SkipLinksProps {
  translations: {
    navigation: NavigationTranslations;
    search: SearchTranslations;
  };
}

export default function SkipLinks({ translations }: SkipLinksProps) {
  return (
    <div className="sr-only focus:not-sr-only">
      <nav aria-label="Skip links" className="bg-primary text-white p-4">
        <ul className="flex flex-col space-y-2">
          <li>
            <a 
              href="#main-content" 
              className="underline hover:no-underline focus:bg-white focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary px-2 py-1 rounded"
            >
              Перейти к основному содержимому
            </a>
          </li>
          <li>
            <a 
              href="#main-navigation" 
              className="underline hover:no-underline focus:bg-white focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary px-2 py-1 rounded"
            >
              Перейти к главной навигации
            </a>
          </li>
          <li>
            <a 
              href="#site-search" 
              className="underline hover:no-underline focus:bg-white focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary px-2 py-1 rounded"
            >
              Перейти к поиску
            </a>
          </li>
          <li>
            <a 
              href="#site-footer" 
              className="underline hover:no-underline focus:bg-white focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary px-2 py-1 rounded"
            >
              Перейти к подвалу сайта
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}