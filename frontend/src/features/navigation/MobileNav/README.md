# Mobile Navigation Components

Responsive mobile navigation system with slide-out panels for menu and search functionality.

## Overview

Mobile navigation appears on screens smaller than `xl` (1280px) and provides:
- **Hamburger menu** - Main navigation links
- **Search panel** - Full-screen search interface
- **Language switcher** - Language selection
- **Smooth animations** - Slide-in/out transitions
- **Scroll locking** - Prevents background scroll when panels open

## Architecture

```
MobileNav/
├── MobileNav.tsx              # Main mobile navigation component
├── HamburgerButton.tsx        # Menu toggle button
├── SearchButton.tsx           # Search toggle button
├── OffcanvasPanel.tsx         # Reusable slide-out panel
├── MobilePanelOverlay.tsx     # Backdrop overlay
├── useMobilePanel.ts          # Panel state management hook
├── menuAnimationReducer.ts    # Animation state reducer
└── styles.ts                  # Centralized styles
```

## Components

### MobileNav.tsx
Main mobile navigation component. Orchestrates menu and search panels.

**Type**: Client Component  
**Visibility**: `< xl` (mobile/tablet)

```tsx
<MobileNavigation
  dictionary={dictionary}
  lang={lang}
/>
```

**Props**:
- `dictionary: Dictionary` - Full translations
- `lang: Lang` - Current language

**Features**:
- Dual panel management (menu + search)
- History state integration
- Mutual exclusivity (one panel at a time)
- Automatic cleanup on navigation

**Layout**:
```
┌──────────────────────────┐
│ [☰]  [Logo]  [EN] [🔍]  │  ← Top bar (h-16)
└──────────────────────────┘
```

### HamburgerButton.tsx
Three-line menu icon that toggles the navigation panel.

**Type**: Client Component

```tsx
<HamburgerButton
  isOpen={isMenuOpen}
  onClick={toggleMenu}
  ariaControls="mobile-menu-content"
  openLabel={dictionary.navigation.accessibility.openMenu}
  closeLabel={dictionary.navigation.accessibility.closeMenu}
  buttonRef={menuToggleRef}
/>
```

**Props**:
- `isOpen: boolean` - Current state
- `onClick: () => void` - Toggle handler
- `ariaControls: string` - Panel ID
- `openLabel: string` - ARIA label when closed
- `closeLabel: string` - ARIA label when open
- `buttonRef?: Ref<HTMLButtonElement>` - Ref for focus management

**Icons**:
- **Closed**: `MenuIcon` (three horizontal lines)
- **Open**: `CloseIcon` (X)

### SearchButton.tsx
Magnifying glass icon that toggles the search panel.

**Type**: Client Component

```tsx
<SearchButton
  isOpen={isSearchOpen}
  onClick={toggleSearch}
  ariaControls="mobile-search-content"
  openLabel={dictionary.search.accessibility.openSearch}
  closeLabel={dictionary.search.accessibility.closeSearch}
  buttonRef={searchToggleRef}
/>
```

**Props**: Same as HamburgerButton

**Icons**:
- **Closed**: `SearchIcon` (magnifying glass)
- **Open**: `CloseIcon` (X)

### OffcanvasPanel.tsx
Reusable slide-out panel component. Used for both menu and search.

**Type**: Client Component

```tsx
<OffcanvasPanel
  id="mobile-menu-content"
  isOpen={isMenuOpen}
  onClose={closeMenu}
  side="left"
  title={dictionary.navigation.accessibility.menuTitle}
  ariaLabel={dictionary.navigation.accessibility.menuDescription}
  panelRef={menuRef}
>
  {/* Panel content */}
</OffcanvasPanel>
```

**Props**:
- `id: string` - Unique panel ID
- `isOpen: boolean` - Visibility state
- `onClose: () => void` - Close handler
- `side: 'left' | 'right'` - Slide direction
- `title: string` - Panel header title
- `ariaLabel: string` - ARIA description
- `panelRef?: Ref<HTMLDivElement>` - Ref for focus management
- `children: ReactNode` - Panel content

**Features**:
- Slide animation (left/right)
- Header with close button
- Backdrop overlay
- Focus trapping
- Scroll container

**Dimensions**:
- Width: `w-4/5 max-w-sm` (80% width, max 384px)
- Height: Full viewport
- Z-index: 60 (panel), 45 (overlay)

### MobilePanelOverlay.tsx
Semi-transparent backdrop shown behind open panels.

**Type**: Client Component

```tsx
<MobilePanelOverlay onClose={closePanel} />
```

**Props**:
- `onClose: () => void` - Click handler

**Styling**:
- Background: `bg-black/10` (10% opacity)
- Full screen coverage
- Z-index: 45

## State Management

### useMobilePanel Hook
Custom hook managing panel lifecycle and behavior.

**Usage**:
```typescript
const {
  isPanelOpen,
  panelRef,
  toggleRef,
  togglePanel,
  handleClose,
  handleContentComplete
} = useMobilePanel({
  side: 'left',
  panelId: 'mobile-menu-content',
  historyStateKey: 'mobileMenuOpen',
  onOtherPanelOpen: () => closeOtherPanel(),
  focusSelector: 'a, button:not([aria-hidden="true"])'
});
```

**Parameters**:
- `side: 'left' | 'right'` - Panel slide direction
- `panelId: string` - DOM element ID
- `historyStateKey: string` - History state identifier
- `onOtherPanelOpen?: () => void` - Callback when other panel opens
- `focusSelector?: string` - Query selector for focus target

**Returns**:
- `isPanelOpen: boolean` - Current state
- `panelRef: Ref<HTMLDivElement>` - Panel DOM ref
- `toggleRef: Ref<HTMLButtonElement>` - Toggle button ref
- `togglePanel: () => void` - Toggle function
- `handleClose: (triggeredByPopstate) => void` - Close function
- `handleContentComplete: () => void` - Content action completion handler

**Features**:
1. **History Integration**
   - Pushes state when panel opens
   - Handles browser back button
   - Cleans up on close

2. **Scroll Locking**
   - Locks body scroll on open
   - Restores scroll on close
   - iOS Safari support

3. **Focus Management**
   - Moves focus to panel on open
   - Returns focus to toggle on close
   - Supports custom focus targets

4. **Keyboard Navigation**
   - ESC key closes panel
   - Tab trapping within panel

5. **Auto-close**
   - Closes on route change
   - Closes when other panel opens

## Panel Behavior

### Opening Sequence
1. User clicks hamburger/search button
2. History state pushed
3. Body scroll locked
4. Panel slides in (300ms)
5. Focus moves to panel content
6. ESC/overlay click handlers attached

### Closing Sequence
1. User clicks close/overlay/ESC/back button
2. Panel slides out (300ms)
3. History state popped (if not popstate-triggered)
4. Body scroll unlocked
5. Focus returns to toggle button
6. Event handlers cleaned up

### Mutual Exclusivity
Only one panel can be open at a time:
```typescript
// Search panel opening closes menu panel
onOtherPanelOpen: () => {
  if (isMenuOpen) {
    closeMenu(false);
  }
}
```

## Styling

All styles centralized in `styles.ts`:

```typescript
import { 
  MOBILE_NAV_STYLES,
  HAMBURGER_BUTTON_STYLES,
  SEARCH_BUTTON_STYLES,
  OFFCANVAS_PANEL_STYLES,
  PANEL_OVERLAY_STYLES,
  PANEL_CONTENT_STYLES
} from './styles';
```

### Style Constants

**MOBILE_NAV_STYLES**:
- `nav.container` - Top navigation bar
- `nav.topBar` - Flex container for buttons
- `sections.left/center/right` - Layout sections
- `spacer` - Empty space placeholder

**HAMBURGER_BUTTON_STYLES** / **SEARCH_BUTTON_STYLES**:
- `button` - Button styles (identical for both)
- `icon` - Icon sizing

**OFFCANVAS_PANEL_STYLES**:
- `panel.base` - Panel container
- `panel.left/right` - Positioning
- `header.container/title/closeButton/closeIcon` - Header elements

**PANEL_OVERLAY_STYLES**:
- `overlay` - Backdrop styling

**PANEL_CONTENT_STYLES**:
- `menu.*` - Menu panel layout
- `search.*` - Search panel layout

## Content

### Menu Panel Content
```tsx
<div className={PANEL_CONTENT_STYLES.menu.container}>
  <div className={PANEL_CONTENT_STYLES.menu.scrollArea}>
    <nav className={PANEL_CONTENT_STYLES.menu.nav}>
      <ul className={PANEL_CONTENT_STYLES.menu.list}>
        <NavLinks 
          dictionary={dictionary}
          lang={lang}
          className="block w-full text-left"
        />
      </ul>
    </nav>
  </div>
</div>
```

### Search Panel Content
```tsx
<div className={PANEL_CONTENT_STYLES.search.container}>
  <MobileSearchContent 
    dictionary={dictionary}
    lang={lang}
    onSearchComplete={closeSearch}
  />
</div>
```

## Animations

### Slide Transitions
CSS-based transform animations:

```css
/* Panel */
transition-transform duration-300 ease-in-out

/* Left panel */
translate-x-0        /* Open */
-translate-x-full    /* Closed */

/* Right panel */
translate-x-0        /* Open */
translate-x-full     /* Closed */
```

### Animation States
Managed by `menuAnimationReducer`:
- `CLOSED` - Panel hidden
- `OPENING_CONTROLS` - Controls animating in
- `FULLY_OPENED` - Panel visible
- `HIDING_CONTROLS` - Controls animating out

## Accessibility

### ARIA Attributes
```tsx
<nav
  aria-label={dictionary.navigation.accessibility.mainNavigation}
  itemScope
  itemType="https://schema.org/SiteNavigationElement"
>
```

### Keyboard Support
- **Tab**: Navigate focusable elements
- **Shift+Tab**: Navigate backwards
- **Escape**: Close panel
- **Enter/Space**: Activate buttons

### Focus Management
- Focus moves to panel on open
- Focus trapped within panel
- Focus returns to toggle on close
- First interactive element focused by default

### Screen Readers
- Announces panel state changes
- Reads panel title on open
- Clear close button label
- Semantic navigation structure

## Responsive Behavior

### Breakpoints
- **< xl (< 1280px)**: Mobile nav visible
- **≥ xl (≥ 1280px)**: Desktop nav visible

### Layout Adjustments
```css
/* Top bar height */
h-16 (64px)

/* Panel width */
sm:  80% of viewport, max 384px
lg:  80% of viewport, max 384px
```

## Performance

### Optimizations
- CSS-only animations (no JS)
- Passive scroll listeners
- Minimal re-renders (proper deps)
- Lazy-loaded search component

### Bundle Size
- Shared between menu and search
- Icon components from central file
- Styles from single constants file

## Testing

### Manual Tests
- [ ] Menu opens/closes smoothly
- [ ] Search opens/closes smoothly
- [ ] Only one panel open at a time
- [ ] Back button closes panel
- [ ] ESC key closes panel
- [ ] Overlay click closes panel
- [ ] Focus management works
- [ ] Scroll locking works
- [ ] Works on iOS Safari
- [ ] Navigation closes panels

### Accessibility Tests
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] ARIA labels present
- [ ] Focus visible throughout
- [ ] Color contrast sufficient

## Common Issues

### Panel Won't Close
**Cause**: History state conflict  
**Solution**: Ensure unique `historyStateKey` per panel

### Scroll Leak
**Cause**: Body scroll unlock not firing  
**Solution**: Check cleanup in `useEffect`

### iOS Scroll Issues
**Cause**: iOS-specific scroll behavior  
**Solution**: Use enhanced `lockBodyScroll` utility

### Focus Not Returning
**Cause**: Toggle ref not set  
**Solution**: Pass `buttonRef` to toggle component

## Related Files

- `/shared/ui/constants.ts` - Animation durations
- `/lib/utils/bodyScrollLock.ts` - Scroll lock utility
- `/shared/primitives/Icons.tsx` - Menu/Search/Close icons
- `/features/search/ui/MobileSearchContent.tsx` - Search panel content
- `/features/navigation/NavLinks.tsx` - Menu panel content

## Future Enhancements

- [ ] Add swipe gesture support
- [ ] Implement panel resizing
- [ ] Add search history in panel
- [ ] Support nested menu items
- [ ] Add panel animations variants
- [ ] Implement panel stacking