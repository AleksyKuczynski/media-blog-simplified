// src/main/components/Article/Caption/Caption.tsx
import { useRef, useCallback, useLayoutEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import type { CaptionBehavior, CaptionMode } from './types';
import {
  detectCaptionMode,
  createMeasurementSignature,
  calculateCaptionHeight,
  calculateCaptionZIndex
} from './utils';
import {
  MEASUREMENT_DEBOUNCE_DELAY,
  CAPTION_BASE_CLASSES,
  CAPTION_THEME_CLASSES,
  CAPTION_CONTENT_CLASSES,
  EXPANSION_INDICATOR_CLASSES,
  EXPANDED_MAX_HEIGHT_RATIO
} from './constants';

interface CaptionProps {
  content: string;
  behavior: CaptionBehavior;
  visible: boolean;
  onCaptionClick?: () => void;
  onModeChange: (mode: CaptionMode) => void;
  navigationLayout: 'horizontal' | 'vertical';
  isActive: boolean;
  imageHeight: number;
  captionEvaluationTrigger?: number;
}

export function Caption({
  content,
  behavior,
  visible,
  onCaptionClick,
  onModeChange,
  navigationLayout,
  isActive,
  imageHeight,
  captionEvaluationTrigger
}: CaptionProps) {
  
  const measureRef = useRef<HTMLDivElement>(null);
  const [measuredHeight, setMeasuredHeight] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const lastMeasurementRef = useRef<string>('');

  // Throttled measurement to prevent infinite loops
  const measureContent = useCallback(() => {
    if (!measureRef.current || !visible || !behavior?.hasContent) return;

    const currentViewportWidth = window.innerWidth;
    const measurementSignature = createMeasurementSignature(
      content.length,
      currentViewportWidth,
      behavior.state
    );
    
    if (measurementSignature === lastMeasurementRef.current) {
      return;
    }

    try {
      const element = measureRef.current;
      const newMode = detectCaptionMode(element);
      const newHeight = element.scrollHeight;
      
      console.log(`Measuring caption: mode=${newMode}, height=${newHeight}px`);
      
      setMeasuredHeight(newHeight);
      lastMeasurementRef.current = measurementSignature;
      
      if (newMode !== behavior.mode) {
        console.log(`Caption mode changed from ${behavior.mode} to ${newMode}`);
        onModeChange(newMode);
      }
      
      if (!isInitialized) {
        setIsInitialized(true);
      }
    } catch (error) {
      console.warn('Error measuring caption:', error);
    }
  }, [behavior?.hasContent, behavior?.mode, behavior?.state, visible, onModeChange, isInitialized, content.length]);

  // Initial measurement
  useLayoutEffect(() => {
    if (!isInitialized) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          measureContent();
        });
      });
    }
  }, [measureContent, isInitialized]);

  // Re-measure on external trigger with debouncing
  useLayoutEffect(() => {
    if (!isInitialized || !captionEvaluationTrigger) return;

    console.log('Caption re-evaluation triggered:', captionEvaluationTrigger);
    
    const timeoutId = setTimeout(() => {
      measureContent();
    }, MEASUREMENT_DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [captionEvaluationTrigger, isInitialized, measureContent]);

  // Don't render if no behavior or no content
  if (!behavior?.hasContent || !visible) return null;
  if (behavior.state === 'collapsed') return null;

  // Show measuring element until initialized
  if (!isInitialized) {
    return (
      <div className="absolute left-0 right-0 bottom-0 opacity-0 pointer-events-none">
        <div 
          ref={measureRef}
          className={twMerge(
            'prose-sm text-on-sf max-w-none',
            CAPTION_CONTENT_CLASSES.DEFAULT,
            CAPTION_CONTENT_CLASSES.ROUNDED,
            CAPTION_CONTENT_CLASSES.SHARP
          )}
          style={{
            lineHeight: 'var(--caption-line-height)',
            paddingTop: 'var(--caption-padding-y)',
            paddingBottom: 'var(--caption-padding-y)'
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    );
  }

  const { mode, state } = behavior;
  const isExpanded = state === 'expanded';
  
  // Handle caption click - only expandable captions are clickable
  const handleCaptionClick = () => {
    if (mode === 'expandable' && onCaptionClick) {
      onCaptionClick();
    }
  };

  const height = calculateCaptionHeight(mode, state, measuredHeight, imageHeight);
  const zIndex = calculateCaptionZIndex(navigationLayout, isExpanded);

  return (
    <div
      className={twMerge(
        CAPTION_BASE_CLASSES,
        CAPTION_THEME_CLASSES.DEFAULT,
        CAPTION_THEME_CLASSES.ROUNDED,
        CAPTION_THEME_CLASSES.SHARP,
        // Interaction states
        mode === 'expandable' && 'cursor-pointer hover:bg-sf/95',
        // Overflow handling
        isExpanded && 'overflow-y-auto'
      )}
      style={{ 
        height,
        zIndex,
        maxHeight: mode === 'expandable' && isExpanded ? `${imageHeight * EXPANDED_MAX_HEIGHT_RATIO}px` : undefined
      }}
      onClick={handleCaptionClick}
      data-caption="true"
      role={mode === 'expandable' ? 'button' : undefined}
      aria-label={mode === 'expandable' ? `${isExpanded ? 'Minimize' : 'Expand'} caption` : undefined}
    >
      <div 
        className={twMerge(
          'prose-sm text-on-sf max-w-none h-full',
          CAPTION_CONTENT_CLASSES.DEFAULT,
          CAPTION_CONTENT_CLASSES.ROUNDED,
          CAPTION_CONTENT_CLASSES.SHARP
        )}
        style={{
          lineHeight: 'var(--caption-line-height)',
          paddingTop: 'var(--caption-padding-y)',
          paddingBottom: 'var(--caption-padding-y)'
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      
      {/* Expansion indicator for expandable captions */}
      {mode === 'expandable' && (
        <div 
          className={EXPANSION_INDICATOR_CLASSES}
          aria-hidden="true"
        >
          {isExpanded ? '−' : '+'}
        </div>
      )}
    </div>
  );
}