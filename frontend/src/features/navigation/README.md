# Navigation Components

Main navigation system for the EventForMe media blog. Provides site-wide navigation, breadcrumbs, and filtering capabilities across desktop and mobile viewports.

## Overview

The navigation system is organized into specialized subsystems:

- **Header Navigation** - Main site navigation (desktop & mobile)
- **Breadcrumbs** - Context-aware breadcrumb navigation
- **Filter** - Article filtering and sorting
- **Skip Links** - Accessibility navigation shortcuts

## Architecture

```
features/navigation/
├── Breadcrumbs/          # Breadcrumb navigation components
│   ├── Breadcrumbs.tsx
│   ├── SmartBreadcrumbs.tsx
│   ├── styles.ts
│   └── types.ts
├── MobileNav/            # Mobile navigation components
│   ├── MobileNav.tsx
│   ├── HamburgerButton.tsx
│   ├── SearchButton.tsx
│   ├── OffcanvasPanel.tsx
│   ├── MobilePanelOverlay.tsx
│   ├── styles.ts
│   └── useMobilePanel.ts
├── Filter/               # Filter and sorting components
│   ├── FilterGroup.tsx
│   ├── SortingControl.tsx
│   ├── styles.ts
│   └── useFilterGroup.ts
├── DesktopNav.tsx        # Desktop navigation
├── Header.tsx            # Main header wrapper
├── NavLinks.tsx          # Navigation link list
├── LanguageSwitcher.tsx  # Language selector
├── SkipLinks.tsx         # Accessibility skip links
└── styles.ts             # Shared navigation styles
```

## Key Features

### Responsive Design
- **Desktop**: Horizontal navigation with full menu
- **Mobile**: Hamburger menu with slide-out panels
- **Breakpoint**: `xl` (1280px)

### Accessibility
- Skip links for keyboard navigation
- ARIA labels and landmarks
- Semantic HTML structure
- Focus management in modals

### SEO
- Structured data for navigation
- Breadcrumb schemas (primary, canonical, alternatives)
- Proper heading hierarchy

## Components

### Header Components

#### `Header.tsx`
Main header wrapper component. Renders appropriate navigation based on viewport.

**Props**: None (SSR component)

**Features**:
- Fixed positioning
- Desktop/mobile navigation switching
- Skip links integration

#### `DesktopNav.tsx`
Desktop navigation bar with centered logo and navigation links.

**Usage**:
```tsx
<DesktopNav lang={lang} dictionary={dictionary} />
```

#### `NavLinks.tsx`
Shared navigation link list used by both desktop and mobile nav.

**Props**:
- `lang: Lang` - Current language
- `dictionary: Dictionary` - Translations
- `className?: string` - Optional styles

### Breadcrumb Components

See [Breadcrumbs/README.md](./Breadcrumbs/README.md) for detailed documentation.

### Mobile Navigation

See [MobileNav/README.md](./MobileNav/README.md) for detailed documentation.

### Filter Components

See [Filter/README.md](./Filter/README.md) for detailed documentation.

### Utility Components

#### `LanguageSwitcher.tsx`
Language selection dropdown.

**Props**:
- `currentLang: Lang` - Current language

#### `SkipLinks.tsx`
Accessibility skip links for keyboard navigation.

**Features**:
- Jump to main content
- Jump to navigation
- Jump to search
- Visually hidden until focused

## Styling Approach

All navigation components use centralized styling via `styles.ts` files:

### Main Styles (`styles.ts`)
```typescript
import { HEADER_STYLES, DESKTOP_NAV_STYLES, MOBILE_NAV_STYLES } from './styles';
```

**Available style groups**:
- `HEADER_STYLES` - Header wrapper
- `DESKTOP_NAV_STYLES` - Desktop navigation layout
- `MOBILE_NAV_STYLES` - Mobile navigation layout
- `SKIP_LINKS_STYLES` - Skip link styles
- `NAV_LINK_STYLES` - Common link styles

### Subsystem Styles
Each subsystem has its own `styles.ts`:
- `Breadcrumbs/styles.ts` - Breadcrumb styles
- `MobileNav/styles.ts` - Mobile nav styles
- `Filter/styles.ts` - Filter styles

## State Management

### Client Components
Components requiring interactivity are marked with `'use client'`:
- `MobileNav` - Menu toggle, panel state
- `FilterGroup` - Filter selection, URL updates
- `LanguageSwitcher` - Dropdown state

### Server Components
Static navigation components remain SSR:
- `Header` - Main wrapper
- `DesktopNav` - Desktop navigation
- `SmartBreadcrumbs` - Context-aware breadcrumbs (uses headers)

## Hooks

### `useMobilePanel`
Manages mobile offcanvas panel state (menu & search).

**Features**:
- Panel open/close
- History state management
- Scroll locking
- Keyboard navigation (ESC to close)
- Focus management

**Usage**:
```typescript
const { isPanelOpen, togglePanel, handleClose } = useMobilePanel({
  side: 'left',
  panelId: 'mobile-menu',
  historyStateKey: 'mobileMenuOpen'
});
```

### `useFilterGroup`
Manages filter and sorting state.

**Features**:
- Category selection
- Sort order management
- URL parameter updates
- Reset functionality

## Accessibility

### ARIA Labels
All navigation components use dictionary-based ARIA labels:

```typescript
aria-label={dictionary.navigation.accessibility.mainNavigation}
```

### Keyboard Navigation
- **Tab**: Navigate through links
- **Enter/Space**: Activate links
- **Escape**: Close mobile panels
- **Arrow keys**: Navigate dropdowns (filter)

### Screen Readers
- Semantic landmarks (`<nav>`, `<header>`)
- Skip links for content jumping
- Live regions for filter updates

## SEO Integration

### Structured Data
Navigation components generate JSON-LD schemas:

**Navigation Schema**:
```typescript
<NavigationSchema dictionary={dictionary} />
```

**Breadcrumb Schema**:
```typescript
<BreadcrumbSchemas schemas={schemas} />
```

### Schema Types
- `SiteNavigationElement` - Main navigation links
- `BreadcrumbList` - Breadcrumb trails (multiple variants)
- `WebSite` with `SearchAction` - Search functionality

## Performance

### Code Splitting
- Client components bundled separately
- Server components pre-rendered
- Dynamic imports for heavy components

### Optimization
- Minimal re-renders via proper dependency arrays
- URL state management (no prop drilling)
- CSS-only animations where possible

## Testing Checklist

- [ ] Desktop navigation displays correctly
- [ ] Mobile menu opens/closes properly
- [ ] Breadcrumbs show correct path
- [ ] Filter updates URL parameters
- [ ] Language switcher works
- [ ] Skip links are keyboard accessible
- [ ] All ARIA labels present
- [ ] Structured data validates
- [ ] Works in both languages (ru/en)

## Common Issues

### Mobile Menu Not Closing
**Cause**: History state conflict  
**Solution**: Check `historyStateKey` uniqueness

### Filter Not Updating
**Cause**: URL parameters not syncing  
**Solution**: Verify `useSearchParams` and `router.push`

### Breadcrumbs Wrong Path
**Cause**: Server headers not available  
**Solution**: Ensure `SmartBreadcrumbs` is server component

## Related Documentation

- [Breadcrumbs/README.md](./Breadcrumbs/README.md) - Breadcrumb system
- [MobileNav/README.md](./MobileNav/README.md) - Mobile navigation
- [Filter/README.md](./Filter/README.md) - Filter system
- [/shared/seo/schemas/](../../shared/seo/schemas/) - SEO schemas
- [/config/i18n/](../../config/i18n/) - Internationalization

## Future Improvements

- [ ] Add search autocomplete
- [ ] Implement mega menu for rubrics
- [ ] Add keyboard shortcuts overlay
- [ ] Improve mobile search UX
- [ ] Add navigation history