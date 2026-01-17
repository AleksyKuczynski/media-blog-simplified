// app/[lang]/[rubric]/[slug]/_components/markdown/parseImageFrames.ts
/**
 * Article Markdown - Image Frame Parser
 * 
 * Converts markdown images to enriched image frames with metadata.
 * Replaces legacy carousel system with single responsive frames.
 * 
 * Process:
 * 1. Parse markdown image syntax ![alt](assetId)
 * 2. Fetch metadata from Directus (dimensions, title)
 * 3. Process caption links (external preserved, slugs removed)
 * 4. Create image-frame chunk with full metadata
 * 
 * Features:
 * - Directus asset metadata enrichment
 * - Caption HTML processing
 * - Responsive image attributes
 * 
 * Dependencies:
 * - ./markdownToHtml (convertSimpleMarkdownToHtml)
 * - ./processCaptionLinks (caption link handling)
 * - ./markdownTypes (ContentChunk, ImageAttributes)
 * - @/api/directus (fetchAssetMetadata)
 * - ./parseMarkdownImage (image syntax parser)
 * 
 * @param chunks - Content chunks with image markdown
 * @returns {ContentChunk[]} Chunks with image-frame replacements
 */

import { convertSimpleMarkdownToHtml } from './markdownToHtml';
import { processCaptionLinks } from './processCaptionLinks';
import { ContentChunk, ImageAttributes } from './markdownTypes';
import { parseMarkdownImage } from './parseMarkdownImage';
import { fetchAssetMetadata } from '@/api/directus';

export async function parseImageFrames(chunks: ContentChunk[]): Promise<ContentChunk[]> {
  const processedChunks: ContentChunk[] = [];

  async function enrichImageAttributes(markdown: string): Promise<ImageAttributes> {
    const parsed = parseMarkdownImage(markdown);
    if (!parsed) {
      throw new Error('Invalid image markdown format');
    }
    
    const metadata = await fetchAssetMetadata(parsed.assetId);
    
    return {
      src: parsed.src,
      alt: metadata?.title || parsed.alt,
      width: metadata?.width || 1200,
      height: metadata?.height || 800,
      title: metadata?.title,
      filename: metadata?.filename_download || metadata?.filename_disk // ✅ FIX: Use correct property names
    };
  }

  for (const chunk of chunks) {
    if (chunk.type === 'image' || chunk.type === 'figure') {
      try {
        // Enrich image with metadata from Directus
        const enrichedAttributes = await enrichImageAttributes(chunk.content || '');

        const hasCaption = chunk.type === 'figure' && chunk.caption && chunk.caption.trim() !== '';
        const processedCaption = hasCaption 
          ? convertSimpleMarkdownToHtml(processCaptionLinks(chunk.caption!))
          : '';

        // Create image-frame chunk
        const imageFrameChunk: ContentChunk = {
          type: 'image-frame',
          imageAttributes: enrichedAttributes,
          caption: hasCaption ? chunk.caption : undefined,
          processedCaption: hasCaption ? processedCaption : undefined,
        };

        processedChunks.push(imageFrameChunk);
      } catch (error) {
        console.error('Error enriching image:', error);
        // Fallback: keep original chunk on error
        processedChunks.push(chunk);
      }
    } else {
      processedChunks.push(chunk);
    }
  }

  return processedChunks;
}