# Filter Components

Article filtering and sorting system for category selection and date ordering.

## Overview

The filter system provides controls for:
- **Category filtering** - Filter articles by category
- **Sort ordering** - Sort by newest/oldest first
- **Quick reset** - Reset to default state

Used in article listing pages (`/articles`, `/category/:slug`).

## Components

### FilterGroup.tsx
Main filter component combining category and sorting controls.

**Type**: Client Component  
**Layout**: Articles listing pages

```tsx
<FilterGroup
  categories={categories}
  dictionary={dictionary}
  lang={lang}
/>
```

**Props**:
- `categories: Category[]` - Available categories
- `dictionary: Dictionary` - Full translations
- `lang: Lang` - Current language

**Features**:
- Category dropdown
- Sort order dropdown
- Reset button
- URL parameter synchronization
- Responsive layout (vertical on mobile, horizontal on desktop)

**Visual Layout**:
```
Desktop:
┌────────────────────────────────────────────┐
│  Category ▼    Sort By ▼       [Reset]    │
└────────────────────────────────────────────┘

Mobile:
┌──────────────┐
│  Category ▼  │
│  Sort By ▼   │
│   [Reset]    │
└──────────────┘
```

### SortingControl.tsx
Standalone sorting dropdown component.

**Type**: Client Component

```tsx
<SortingControl
  dictionary={dictionary}
  currentSort={currentSort}
  lang={lang}
/>
```

**Props**:
- `dictionary: Dictionary` - Translations
- `currentSort: string` - Current sort value ('desc' | 'asc')
- `lang: Lang` - Current language

**Features**:
- Date sort dropdown (newest/oldest)
- URL parameter updates
- No page reload on change
- Visual selected state

**Sort Options**:
- **Newest First** (`desc`) - Default
- **Oldest First** (`asc`)

## State Management

### useFilterGroup Hook
Manages filter state and URL synchronization.

**Usage**:
```typescript
const {
  currentSort,
  categoryItems,
  filterLabels,
  selectedCategoryName,
  handleCategoryChange,
  handleReset
} = useFilterGroup({
  categories,
  dictionary,
  lang
});
```

**Returns**:
- `currentSort: string` - Current sort order ('desc'/'asc')
- `categoryItems: DropdownItemType[]` - Category dropdown items
- `filterLabels: object` - All filter labels from dictionary
- `selectedCategoryName: string` - Currently selected category name
- `handleCategoryChange: (item) => void` - Category selection handler
- `handleReset: () => void` - Reset to default state

**State Sources**:
- **Category**: From URL pathname (`/category/:slug`)
- **Sort**: From URL search params (`?sort=desc`)

**URL Updates**:
```typescript
// Category change
/articles → /category/theatre?sort=desc

// Sort change
?sort=desc → ?sort=asc

// Reset
/category/theatre?sort=asc → /articles?sort=desc
```

### useFilterValidation Hook
Validates dictionary structure for filter components.

**Usage**:
```typescript
const validation = useFilterValidation(dictionary, categories);

if (!validation.isValid) {
  console.warn('Issues:', validation.issues);
}
```

**Checks**:
- Dictionary has `filter` section
- All required labels present
- Categories array valid

## URL Parameters

### Category Selection
**Pattern**: `/category/:categorySlug`

```
/articles                    → All categories
/category/theatre           → Theatre category
/category/music             → Music category
```

### Sort Parameter
**Pattern**: `?sort=desc|asc`

```
?sort=desc   → Newest first (default)
?sort=asc    → Oldest first
```

### Combined
```
/category/theatre?sort=asc   → Theatre articles, oldest first
```

## Styling

All styles centralized in `styles.ts`:

```typescript
import { 
  FILTER_STYLES,
  FILTER_CONTROL_STYLES,
  FILTER_BUTTON_STYLES
} from './styles';
```

### Style Constants

**FILTER_STYLES**:
- `container.base` - Main horizontal layout
- `container.minimal` - Minimal version layout
- `container.centered` - Centered single control

**FILTER_CONTROL_STYLES**:
- `wrapper` - Control wrapper (no gap)
- `wrapperWithGap` - Control wrapper with gap
- `label` - Control label
- `resetButtonWrapper` - Reset button container

**FILTER_BUTTON_STYLES**:
- `dropdown.base` - Full width dropdown
- `dropdown.wide` - Desktop width (sm:w-48)
- `dropdown.centered` - Centered width (w-64)
- `icon` - Chevron icon
- `text.base` - Truncated text

## Dropdown Integration

Uses shared Dropdown component from `/shared/ui/Dropdown`:

```tsx
<Dropdown
  items={categoryItems}
  onSelect={handleCategoryChange}
  width="wide"
  position="left"
>
  <DropdownTrigger>
    <NavButton className={FILTER_BUTTON_STYLES.dropdown.wide}>
      <span>{selectedCategoryName}</span>
      <ChevronDownIcon className={FILTER_BUTTON_STYLES.icon} />
    </NavButton>
  </DropdownTrigger>
  <DropdownContent>
    {categoryItems.map((item, index) => (
      <DropdownItem
        key={item.id}
        item={item}
        index={index}
        isSelected={Boolean(item.selected)}
        onSelect={() => handleCategoryChange(item)}
      />
    ))}
  </DropdownContent>
</Dropdown>
```

## Variants

### MinimalFilterGroup
Simplified filter showing only current selection and reset.

```tsx
<MinimalFilterGroup
  categories={categories}
  dictionary={dictionary}
  lang={lang}
/>
```

**Usage**: Mobile simplified view or secondary listings

**Layout**:
```
Category: Theatre     [Reset]
```

### CategoryOnlyFilter
Only category dropdown, no sorting.

```tsx
<CategoryOnlyFilter
  categories={categories}
  dictionary={dictionary}
  lang={lang}
/>
```

**Usage**: Category-focused pages

**Layout**:
```
     Category ▼
```

## Helper Functions

### From `/config/i18n/helpers/filter.ts`

#### `getFilterLabels(dictionary)`
Extracts filter labels from dictionary.

```typescript
const labels = getFilterLabels(dictionary);
// Returns: { allCategories, reset, sortOrder, category, newest, oldest }
```

#### `getSortingOptions(dictionary)`
Gets sorting option labels.

```typescript
const options = getSortingOptions(dictionary);
// Returns: { newest, oldest, label }
```

#### `generateCategoryDropdownItems(dictionary, categories, currentCategory)`
Creates dropdown items with selection state.

```typescript
const items = generateCategoryDropdownItems(dictionary, categories, 'theatre');
// Returns: [
//   { id: 'all', label: 'Все категории', value: '', selected: false },
//   { id: 'theatre', label: 'Театр', value: 'theatre', selected: true },
//   ...
// ]
```

#### `getFilterAccessibilityData(dictionary)`
Gets ARIA labels for filter controls.

```typescript
const accessibility = getFilterAccessibilityData(dictionary);
// Returns: { categorySelector, sortingControl, resetButton, ... }
```

## Dictionary Structure

Filter components require these dictionary entries:

```typescript
dictionary.filter = {
  labels: {
    sortBy: 'Сортировать по',
    category: 'Категория',
    allCategories: 'Все категории',
    newest: 'Сначала новые',
    oldest: 'Сначала старые',
    reset: 'Сбросить',
    apply: 'Применить'
  },
  accessibility: {
    categorySelector: 'Выбор категории',
    sortingControl: 'Управление сортировкой',
    resetButton: 'Сбросить фильтры',
    filterGroup: 'Группа фильтров',
    dropdownLabel: 'Выпадающий список'
  }
};
```

## Accessibility

### ARIA Labels
All controls have proper ARIA labels:

```tsx
<nav aria-label={accessibility.filterGroup}>
  <button aria-label={accessibility.categorySelector}>
    Category ▼
  </button>
  <button aria-label={accessibility.sortingControl}>
    Sort ▼
  </button>
  <button aria-label={accessibility.resetButton}>
    Reset
  </button>
</nav>
```

### Keyboard Navigation
- **Tab**: Move between controls
- **Enter/Space**: Open dropdown
- **Arrow keys**: Navigate dropdown items
- **Escape**: Close dropdown

### Screen Reader Support
- Announces current selection
- Reads all available options
- Indicates when filter is active

## Layout Integration

Filter appears in special layout wrapper:

**File**: `/app/[lang]/(with-filter)/layout.tsx`

```tsx
export default async function WithFilterLayout({ params, children }) {
  const categories = await fetchAllCategories(lang);
  
  return (
    <>
      <Suspense fallback={<FilterSkeleton />}>
        <FilterGroup
          categories={categories}
          dictionary={dictionary}
          lang={lang}
        />
      </Suspense>
      {children}
    </>
  );
}
```

**Applied to routes**:
- `/[lang]/articles`
- `/[lang]/category/[slug]`

## Loading States

### Skeleton Loader
Shown while filter loads:

```tsx
<div className="mb-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4">
  {/* Category dropdown skeleton */}
  <div className="flex flex-col">
    <div className="mb-2 h-4 w-20 bg-gray-200 rounded animate-pulse" />
    <div className="h-10 w-full sm:w-48 bg-gray-200 rounded-md animate-pulse" />
  </div>
  
  {/* Sort dropdown skeleton */}
  <div className="flex flex-col">
    <div className="mb-2 h-4 w-20 bg-gray-200 rounded animate-pulse" />
    <div className="h-10 w-full sm:w-48 bg-gray-200 rounded-md animate-pulse" />
  </div>
  
  {/* Reset button skeleton */}
  <div className="flex flex-col justify-end">
    <div className="h-10 w-full sm:w-32 bg-gray-200 rounded-md animate-pulse" />
  </div>
</div>
```

## Error Handling

### Validation
Component validates inputs before rendering:

```typescript
const validation = useFilterValidation(dictionary, categories);

if (!validation.isValid) {
  console.warn('FilterGroup validation issues:', validation.issues);
  // Renders fallback UI
}
```

### Fallback UI
On error, renders simplified static filter:

```tsx
<div className={FILTER_STYLES.container.base}>
  <div>{filterLabels.category}: {filterLabels.allCategories}</div>
  <div>{filterLabels.sortOrder}: {filterLabels.newest}</div>
  <button onClick={() => redirect()}>
    {filterLabels.reset}
  </button>
</div>
```

## Performance

### Optimizations
- Minimal re-renders (proper dependencies)
- No page reload on filter change
- URL state only (no local state)
- Memoized category items

### Bundle Size
- Shared Dropdown component
- Centralized styles
- Tree-shakeable helpers

## Usage Example

### Complete Implementation

```tsx
// app/[lang]/articles/page.tsx
import FilterGroup from '@/features/navigation/Filter/FilterGroup';
import { fetchAllCategories, fetchArticles } from '@/api/directus';
import { getDictionary } from '@/config/i18n';

export default async function ArticlesPage({ params, searchParams }) {
  const { lang } = params;
  const sort = searchParams.sort || 'desc';
  
  const [categories, dictionary] = await Promise.all([
    fetchAllCategories(lang),
    getDictionary(lang)
  ]);
  
  const articles = await fetchArticles(lang, {
    sort: sort === 'asc' ? 'published_at' : '-published_at'
  });

  return (
    <>
      <FilterGroup
        categories={categories}
        dictionary={dictionary}
        lang={lang}
      />
      
      <ArticleGrid articles={articles} />
    </>
  );
}
```

## Testing

### Manual Tests
- [ ] Category dropdown works
- [ ] Sort dropdown works
- [ ] Reset button works
- [ ] URL updates correctly
- [ ] No page reload on change
- [ ] Selected state visible
- [ ] Responsive layout works
- [ ] Works in both languages

### Accessibility Tests
- [ ] Keyboard navigation works
- [ ] Screen reader announces changes
- [ ] ARIA labels present
- [ ] Focus visible
- [ ] Color contrast sufficient

## Common Issues

### Filter Not Updating
**Cause**: URL parameters not syncing  
**Solution**: Check `useSearchParams()` and `router.push()`

### Wrong Category Selected
**Cause**: Pathname parsing incorrect  
**Solution**: Verify category slug extraction logic

### Reset Not Working
**Cause**: Navigation not triggering  
**Solution**: Use `router.push()` instead of `window.location`

## Related Files

- `/config/i18n/helpers/filter.ts` - Filter helpers
- `/shared/ui/Dropdown/` - Dropdown component
- `/app/[lang]/(with-filter)/layout.tsx` - Filter layout
- `/api/directus.ts` - Category fetching

## Future Enhancements

- [ ] Add tag filtering
- [ ] Support date range filter
- [ ] Add author filter
- [ ] Implement filter presets
- [ ] Add filter analytics
- [ ] Support filter combinations
- [ ] Add filter URL sharing