# Development Journal - Simplified Media Blog Fork

## Project Status Overview
**Last Updated:** August 27, 2025  
**Version:** Fork - Simplification in Progress  
**Repository:** `media-blog-simplified` (separate instance)  
**Priority:** Surgical removal approach with progressive simplification

## Simplification Strategy - Revised Order

### ✅ **Phase 0: Repository Setup** - COMPLETE
- [x] GitHub fork created with separate Vercel deployment
- [x] Environment variables configured
- [x] Baseline functionality verified
- [x] Working with existing Directus multi-language test content (using Russian only)

### ✅ **Phase 1: Carousel → ImageFrame Transformation** - COMPLETE
- [x] Extracted mathematical frame sizing calculations to `/lib/image-utils/`
- [x] Created ImageFrame component using preserved responsive mathematics
- [x] Integrated existing Caption component system
- [x] Updated markdown processing (parseCarousels → parseImageFrames)
- [x] Removed carousel complexity while maintaining sizing quality
- [x] Achieved ~15-20% bundle size reduction
- [x] All carousel errors resolved

### 🔄 **Phase 2: Multi-language Removal** - CURRENT
**Goal**: Remove carousel complexity, preserve frame sizing mathematics

**Components to Transform:**
- **Remove**: CarouselTrack, CarouselNavigation, carousel state management, sliding animations
- **Extract & Preserve**: Mathematical frame sizing calculations from `calculateCarouselDimensions.ts`
- **Create**: New `ImageFrame` component using preserved math
- **Create**: Separate `ImageCaption` component for reusable captions

**Key Mathematics to Preserve:**
- Viewport-responsive ratio calculations
- Breakpoint-specific dimensional constraints  
- Dynamic height/width optimization
- Image display mode determination (`center-horizontal`, `center-vertical`, `square`)
- Median ratio calculation from image sets

### ⏳ **Phase 2: Multi-language Removal** - NEXT
- [ ] Remove language detection middleware
- [ ] Flatten route structure from `/[lang]/` to root
- [ ] Replace dictionary system with static Russian strings
- [ ] Simplify Directus queries to Russian-only content

### ⏳ **Phase 3: Theme System Simplification** 
- [ ] Keep only "rounded" geometric theme
- [ ] Maintain light/dark color modes
- [ ] Remove theme selection UI and logic
- [ ] Simplify CSS variables to single geometric set

### ⏳ **Phase 4: Footer Simplification**
- [ ] Remove interactive forms, social links, surprise sections
- [ ] Remove FAQ and help center references (no resources available)
- [ ] Keep only: basic SEO info, essential navigation, structured data
- [ ] Implement single-column mobile layout

### ⏳ **Phase 5: Final Styling Optimization**
- [ ] Maintain Tailwind with component-level management
- [ ] Move shared styles to appropriate parent components
- [ ] Remove unused theme variant classes

### 🚀 **Phase 6: Framework Migration** - POSTPONED
- [ ] Upgrade React to latest version
- [ ] Upgrade Next.js to latest version
- [ ] Update dependencies
- ⚠️ **Decision**: Postponed until after simplification to isolate risks

---

## Technical Architecture - Simplified Approach

### **Styling Philosophy** (Unchanged)
- ✅ Component-level styling management only
- ✅ Wrapper components handle group styling  
- ❌ No shared component style storage
- ✅ globals.scss limited to: colors, fonts, geometric constants

### **Selected Design System**
- **Theme**: "Rounded" (smartphone-style) theme only
- **Colors**: Light/dark mode via browser settings
- **Typography**: Maintain existing font hierarchy
- **Layout**: Preserve responsive breakpoints

### **Preserved Mathematical Systems**
- **Frame Sizing**: Viewport-responsive image frame calculations
- **Aspect Ratio Logic**: Content-adaptive ratio determination
- **Breakpoint Constraints**: Mobile/tablet/desktop optimization
- **Display Mode Selection**: Smart image positioning logic

---

## Current Phase 1 Progress

### **Carousel Analysis - Components to Remove:**
```
/Carousel/
├── ImageCarousel.tsx        → DELETE (main carousel component)
├── CarouselTrack.tsx       → DELETE (sliding track)  
├── CarouselNavigation.tsx  → DELETE (prev/next controls)
├── Carousel.module.scss    → DELETE (complex animations)
├── hooks/
│   ├── useCarousel.ts      → DELETE (state management)
│   └── useViewportChange.ts → EXTRACT (viewport logic)
└── utils/
    ├── calculateCarouselDimensions.ts → PRESERVE (core math)
    ├── breakpointConstraints.ts       → PRESERVE (sizing rules)
    └── carouselUtils.ts              → EXTRACT (utilities)
```

### **Mathematics to Extract & Apply:**
1. **`calculateCarouselDimensions()`**: Main responsive calculation function
2. **`calculateOptimalRatio()`**: Smart ratio determination based on content + viewport
3. **`calculateMaxHeightForBreakpoint()`**: Viewport-constrained height calculation
4. **Breakpoint constraint system**: Mobile/tablet/desktop sizing rules
5. **Image display mode logic**: Automatic positioning (`center-horizontal`/`center-vertical`/`square`)

### **New Components to Create:**
- `ImageFrame.tsx`: Single image with preserved frame sizing math
- `ImageCaption.tsx`: Extracted caption functionality for reusability
- `ImageFrameGroup.tsx`: Multiple images in simple grid (if needed)

---

## Implementation Notes

### **Phase 1 Technical Approach:**
1. **Extract Core Math**: Move calculation functions to `@/lib/image-utils/`
2. **Simplify Interfaces**: Remove carousel-specific types, keep sizing types
3. **Create ImageFrame**: Apply calculations to simple `next/image` component
4. **Test Frame Sizing**: Verify responsive behavior matches carousel quality
5. **Update Markdown Processing**: Replace carousel calls with ImageFrame

### **Security Considerations:**
- ✅ Preserved TypeScript typing throughout extraction
- ✅ Maintained input validation in mathematical functions  
- ✅ No additional security vectors introduced

### **Performance Expected Improvements:**
- **Bundle Size**: ~15-20% reduction from carousel removal
- **Runtime**: Eliminate carousel state management overhead
- **Hydration**: Simpler client-side JavaScript footprint
- **First Paint**: Faster initial render without carousel complexity

---

## Next Steps - Phase 1

1. **Extract Mathematics** (Current): Move calculation utilities to shared location
2. **Create ImageFrame Component**: Implement with preserved sizing logic  
3. **Update Markdown Processing**: Replace carousel references
4. **Test Responsive Behavior**: Verify frame sizing across breakpoints
5. **Clean Up**: Remove carousel files and dependencies

**Estimated Completion**: 1-2 development sessions

---

## Environment & Tools

### **Development Setup:**
```bash
pnpm dev          # Development server
pnpm build        # Production build test
```

### **Key Locations:**
- **Current Carousel**: `/src/main/components/Article/Carousel/`
- **Mathematics**: `/src/main/components/Article/Carousel/utils/`
- **Markdown Processing**: `[location for markdown carousel integration]`
- **New Image Utils**: `/src/main/lib/image-utils/` (to be created)

### **Deployment:**
- **Development**: `http://localhost:3000`
- **Staging**: Separate Vercel instance on `simplification` branch
- **Directus**: Using existing instance with Russian content focus