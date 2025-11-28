// app/[lang]/[rubric]/[slug]/_components/content/CustomBlockquote.tsx
/**
 * Article Content - Custom Blockquote Block
 * 
 * Enhanced blockquote with custom styling and optional attribution.
 * Extracted during markdown preprocessing.
 * 
 * Features:
 * - Custom delimiter: >>
 * - HTML content support
 * - Citation support
 * 
 * Dependencies:
 * - article.styles.ts (BLOCKS_STYLES.blockquote)
 * 
 * @param content - HTML content (may contain inline formatting)
 */

import { BlockquoteProps } from '../markdown/markdownTypes';
import { Type1Blockquote } from './Type1Blockquote';
import { Type2Blockquote } from './Type2Blockquote';
import { Type3Blockquote } from './Type3Blockquote';
import { Type4Blockquote } from './Type4Blockquote';

export function CustomBlockquote(props: BlockquoteProps) {
  switch (props.type) {
    case '1':
      return <Type1Blockquote content={props.content} />;
    case '2':
      return <Type2Blockquote content={props.content} author={props.author} />;
    case '3':
      return <Type3Blockquote 
        content={props.content} 
        author={props.author} 
        source={props.source}
      />;
    case '4':
      return <Type4Blockquote 
        content={props.content} 
        author={props.author} 
        avatarUrl={props.avatarUrl}
      />;
    default:
      console.error('Unknown blockquote type');
      return null;
  }
}