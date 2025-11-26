// src/main/components/Search/page/SearchTips.tsx
// Search tips section using collapsible component
// Collapsed on mobile, expanded on desktop

'use client'

import Collapsible from '../../Interface/Collapsible';
import { SearchIcon } from '../../Interface';
import { Dictionary } from '@/main/lib/dictionary';

interface SearchTipsProps {
  readonly dictionary: Dictionary;
  readonly className?: string;
}

/**
 * SearchTips - Collapsible search tips section
 * 
 * Features:
 * - Uses generic Collapsible component
 * - Collapsed on mobile, expanded on desktop (md breakpoint)
 * - Content from dictionary for i18n
 * - Helpful guidance for users
 * 
 * Usage on search page:
 * - Always visible at top of search hub
 * - Provides context and instructions
 */
export default function SearchTips({
  dictionary,
  className = ''
}: SearchTipsProps) {
  const tips = dictionary.search.hub?.tips || [
    dictionary.search.labels.minCharacters,
    'Используйте ключевые слова для лучших результатов',
    'Попробуйте разные формулировки запроса',
    'Поиск работает по статьям, авторам и рубрикам',
  ];

  const tipsTitle = dictionary.search.hub?.tipsTitle || 'Советы по поиску';

  return (
    <div className={`mb-6 ${className}`}>
      <Collapsible
        title={tipsTitle}
        defaultOpen={false}
        breakpoint="md"
        icon={<SearchIcon className="w-5 h-5" />}
        ariaLabel={`${tipsTitle} - развернуть для просмотра подсказок`}
        className="bg-sf-cont/50 border border-ol-var/20"
        titleClassName="hover:bg-sf-hi/70"
        contentClassName="text-on-sf-var"
      >
        <ul className="space-y-2 text-sm">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-pr-cont font-bold mt-1">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </Collapsible>
    </div>
  );
}