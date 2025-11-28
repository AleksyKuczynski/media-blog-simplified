// src/main/components/Search/page/SearchTips.tsx
'use client'

import { SearchIcon } from '@/shared/primitives/Icons';
import Collapsible from '@/shared/ui/Collapsible';
import { Dictionary } from '@/config/i18n';

interface SearchTipsProps {
  readonly dictionary: Dictionary;
}

export default function SearchTips({ dictionary }: SearchTipsProps) {
  if (!dictionary.search.hub) return null;

  const { tipsTitle, tips } = dictionary.search.hub;

  return (
    <Collapsible
      title={tipsTitle}
      icon={<SearchIcon className="w-5 h-5" />}
      ariaLabel={tipsTitle}
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
  );
}