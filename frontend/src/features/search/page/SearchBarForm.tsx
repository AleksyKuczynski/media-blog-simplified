// src/features/search/page/SearchBarForm.tsx
'use client'

import SearchDropdown from '../ui/SearchDropdown';
import SearchInput from '../ui/SearchInput';
import { useSearchLogic } from '../logic/useSearchLogic';
import { Dictionary, Lang } from '@/config/i18n';
import { SearchIcon } from '@/shared/primitives/Icons';
import { SEARCH_BAR_FORM_STYLES } from '../search.styles';

interface SearchBarFormProps {
  readonly dictionary: Dictionary;
  readonly lang: Lang;
  readonly currentQuery?: string;
  readonly className?: string;
}

export default function SearchBarForm({
  dictionary,
  lang,
  className = ''
}: SearchBarFormProps) {
  const {
    state,
    handlers,
    refs,
  } = useSearchLogic({
    mode: 'standard',
    lang
  });

  return (
    <search 
      ref={refs.containerRef}
      className={`${SEARCH_BAR_FORM_STYLES.container} ${className}`}
      role="search"
      aria-label={dictionary.search.accessibility.searchLabel}
      itemScope
      itemType="https://schema.org/SearchAction"
    >
      <meta itemProp="target" content={`https://${dictionary.seo.site.url}/${lang}/search?search={search_term_string}`} />
      <meta itemProp="query-input" content="required name=search_term_string" />
      
      <div className={SEARCH_BAR_FORM_STYLES.wrapper}>
        <div className={SEARCH_BAR_FORM_STYLES.inputWrapper}>
          <div className={SEARCH_BAR_FORM_STYLES.icon}>
            <SearchIcon className={SEARCH_BAR_FORM_STYLES.iconSize} />
          </div>
          
          <SearchInput
            state={state}
            placeholder={dictionary.search.labels.placeholder}
            onChange={handlers.handleInputChange}
            onKeyDown={handlers.handleKeyDown}
            onFocus={handlers.handleFocus}
            inputRef={refs.inputRef}
            ariaLabel={dictionary.search.accessibility.searchInputLabel}
            ariaDescription={dictionary.search.accessibility.searchDescription}
          />
        </div>

        <SearchDropdown
          state={state}
          dict={dictionary}
          onItemSelect={handlers.handleSelect}
          className={SEARCH_BAR_FORM_STYLES.dropdown}
          ariaLabel={dictionary.search.accessibility.searchResultsLabel}
        />
      </div>
    </search>
  );
}