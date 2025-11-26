// src/main/components/Search/page/SearchTips.tsx
'use client'

import Collapsible from '../../Interface/Collapsible';
import { SearchIcon } from '../../Interface';
import { Dictionary } from '@/main/lib/dictionary';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';

interface SearchTipsProps {
  readonly dictionary: Dictionary;
  readonly className?: string;
}

export default function SearchTips({
  dictionary,
  className = ''
}: SearchTipsProps) {
  if (!dictionary.search.hub) return null;

  const { tipsTitle, tips } = dictionary.search.hub;

  return (
    <div className={`mb-6 ${className}`}>
      <Collapsible
        title={tipsTitle}
        defaultOpen={false}
        breakpoint="md"
        icon={<SearchIcon className="w-5 h-5" />}
        ariaLabel={tipsTitle}
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