// src/main/components/Search/page/SearchBarForm.tsx
'use client'

import { SearchIcon } from '../../../main/components/Interface';
import SearchDropdown from '../ui/SearchDropdown';
import SearchInput from '../ui/SearchInput';
import { useSearchLogic } from '../logic/useSearchLogic';
import { Dictionary, Lang } from '@/main/lib/dictionary';

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
      className={`w-full ${className}`}
      role="search"
      aria-label={dictionary.search.accessibility.searchLabel}
      itemScope
      itemType="https://schema.org/SearchAction"
    >
      <meta itemProp="target" content={`https://${dictionary.seo.site.url}/${lang}/search?search={search_term_string}`} />
      <meta itemProp="query-input" content="required name=search_term_string" />
      
      <div className="relative">
        <div className="
          flex items-center gap-3
          bg-sf-hi rounded-lg shadow-md
          hover:shadow-lg
          focus-within:ring-2
          focus-within:ring-pr-fix
          focus-within:ring-offset-2
          transition-all duration-200
          px-4 py-3
        ">
          <div className="text-on-sf-var pointer-events-none flex-shrink-0">
            <SearchIcon className="w-6 h-6" />
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
          className="rounded-lg shadow-lg"
          ariaLabel={dictionary.search.accessibility.searchResultsLabel}
        />
      </div>
    </search>
  );
}