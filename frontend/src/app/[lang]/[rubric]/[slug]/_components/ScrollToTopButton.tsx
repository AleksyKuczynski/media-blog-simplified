// src/app/[lang]/[rubric]/[slug]/_components/ScrollToTopButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { ChevronUpIcon } from '@/main/components/Interface/Icons';
import { FloatingButton } from '@/main/components/Interface/FloatingButton';
import { WIDGETS_STYLES } from './article.styles';

const styles = WIDGETS_STYLES.scrollToTop;

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <FloatingButton onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <ChevronUpIcon className={styles.icon} />
    </FloatingButton>
  );
}