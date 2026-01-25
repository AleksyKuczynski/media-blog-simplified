// src/features/search/page/SearchTips.tsx
'use client'

import Collapsible from '@/shared/ui/Collapsible';
import { Dictionary } from '@/config/i18n';
import { SEARCH_PAGE_STYLES } from '../search.styles';

interface SearchTipsProps {
  readonly dictionary: Dictionary;
}

export default function SearchTips({ dictionary }: SearchTipsProps) {
  if (!dictionary.search.hub) return null;

  const { tipsTitle, tips } = dictionary.search.hub;

  return (
    <Collapsible
      title={tipsTitle}
      ariaLabel={tipsTitle}
    >
      <ul className={SEARCH_PAGE_STYLES.tips.list}>
        {tips.map((tip, index) => (
          <li key={index} className={SEARCH_PAGE_STYLES.tips.item}>
            <span className={SEARCH_PAGE_STYLES.tips.span}>•</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </Collapsible>
  );
}