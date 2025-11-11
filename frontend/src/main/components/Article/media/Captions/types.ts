export type CaptionMode = 'static' | 'expandable';

// Caption states - different meanings based on mode
export type CaptionState = 'expanded' | 'minimized' | 'collapsed';

// Static captions: expanded (visible, natural height) | collapsed (hidden)
// Expandable captions: minimized (3 lines) | expanded (up to 80%) | collapsed (hidden)

export interface CaptionBehavior {
  mode: CaptionMode;
  state: CaptionState;
  hasContent: boolean; // True if caption exists and is not empty
}

// Combined carousel item with client-side caption behavior
export interface CarouselItemWithBehavior {
  type: 'image' | 'figure';
  imageAttributes: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    title?: string;
    filename?: string;
  };
  caption?: string;
  processedCaption: string;
  captionBehavior: CaptionBehavior;
}

// Configuration interface for caption component
export interface CaptionConfig {
  content: string;
  behavior: CaptionBehavior;
  visible: boolean;
  navigationLayout?: 'horizontal' | 'vertical';
  imageHeight?: number;
  onCaptionClick?: () => void;
  onModeChange?: (mode: CaptionMode) => void;
  evaluationTrigger?: number;
}
