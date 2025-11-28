// src/main/components/Search/index.ts
// External imports (re-exported)
export { SearchIcon, CloseIcon, NavButton } from '../../main/components/Interface';

// Internal exports
export { default as ExpandableSearch } from './desktop/ExpandableSearch';
export { default as MobileSearchContent } from './mobile/MobileSearchContent';
export { default as SearchResultsHeader } from './page/SearchResultsHeader';
export { default as SearchBarForm } from './page/SearchBarForm';  // UPDATED
export { default as SearchResults } from './page/SearchResults';  // NEW
export { default as SearchTips } from './page/SearchTips';
export * from './types';