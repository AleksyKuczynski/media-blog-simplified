// src/main/lib/markdown/parseImageFrames.ts

import { convertSimpleMarkdownToHtml } from './markdownToHtml';
import { processCaptionLinks } from './processCaptionLinks';
import { ContentChunk, ImageAttributes } from './markdownTypes';
import { fetchAssetMetadata } from '../../../../../../main/lib/directus';
import { parseMarkdownImage } from './parseMarkdownImage';

/**
 * Processes image chunks and converts them to individual image frames
 * Replaces the carousel system with single responsive image frames
 */
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
      filename: metadata?.filename
    };
  }

  // Process each chunk individually - no grouping into carousels
  for (const chunk of chunks) {
    if (chunk.type === 'image' || chunk.type === 'figure') {
      try {
        // Enrich image with metadata from Directus
        const enrichedAttributes = await enrichImageAttributes(chunk.content || '');
        
        // Process caption if present
        // ✅ NEW: Process links in captions before HTML conversion
        // - External links preserved
        // - Article slugs converted to plain text
        // - Invalid links converted to plain text or removed
        const hasCaption = chunk.type === 'figure' && chunk.caption && chunk.caption.trim() !== '';
        const processedCaption = hasCaption 
          ? convertSimpleMarkdownToHtml(processCaptionLinks(chunk.caption!))
          : '';

        // Create image-frame chunk instead of carousel
        const imageFrameChunk: ContentChunk = {
          type: 'image-frame',
          imageAttributes: enrichedAttributes,
          caption: hasCaption ? chunk.caption : undefined,
          processedCaption,
        };

        processedChunks.push(imageFrameChunk);

      } catch (error) {
        console.error('Error processing image for frame:', error);
        // Fall back to original chunk if processing fails
        processedChunks.push(chunk);
      }
    } else {
      // Non-image chunks pass through unchanged
      processedChunks.push(chunk);
    }
  }

  return processedChunks;
}

/**
 * Helper function to determine if consecutive images should be grouped
 * For future enhancement - could group related images into a simple grid
 */
export function shouldGroupImages(chunks: ContentChunk[]): boolean {
  // For now, we don't group - each image gets its own frame
  // Future enhancement: detect related images and create simple grid layouts
  return false;
}

/**
 * Alternative function for creating simple image groups (future enhancement)
 */
export async function createImageGroup(imageChunks: ContentChunk[]): Promise<ContentChunk> {
  // Future enhancement: create simple grid layout for related images
  // For now, this is just a placeholder
  
  const processedImages = [];
  
  for (const chunk of imageChunks) {
    if (chunk.content) {
      const enrichedAttributes = await enrichImageAttributes(chunk.content);
      processedImages.push({
        imageAttributes: enrichedAttributes,
        caption: chunk.caption,
        // ✅ UPDATED: Use processCaptionLinks for image groups too
        processedCaption: chunk.caption 
          ? convertSimpleMarkdownToHtml(processCaptionLinks(chunk.caption)) 
          : ''
      });
    }
  }

  return {
    type: 'image-group',
    images: processedImages
  };
}

// Helper function (extracted from original parseCarousels)
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
    filename: metadata?.filename
  };
}