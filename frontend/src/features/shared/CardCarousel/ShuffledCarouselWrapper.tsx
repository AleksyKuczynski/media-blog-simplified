'use client';

import { useLayoutEffect, useRef } from 'react';

interface Props {
  visibleCount: number;
  children: React.ReactNode;
}

export default function ShuffledCarouselWrapper({ visibleCount, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = ref.current;
    if (!container) return;
    const items = Array.from(container.querySelectorAll<HTMLElement>('[data-carousel-item]'));
    if (items.length <= visibleCount) return;

    const indices = Array.from({ length: items.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const visibleSet = new Set(indices.slice(0, visibleCount));

    items.forEach((item, i) => {
      if (!visibleSet.has(i)) {
        item.setAttribute('aria-hidden', 'true');
        item.style.display = 'none';
      }
    });
  }, [visibleCount]);

  return <div ref={ref}>{children}</div>;
}