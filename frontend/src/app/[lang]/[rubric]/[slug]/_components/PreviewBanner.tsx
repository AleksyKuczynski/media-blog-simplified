// app/[lang]/[rubric]/[slug]/_components/PreviewBanner.tsx
/**
 * Article Page - Preview Mode Banner
 * 
 * Client component that displays a fixed banner when viewing
 * unpublished articles in preview mode.
 * 
 * Positioned at top of viewport, dismissible by user.
 * Only shown when preview query params are valid.
 * 
 * Dependencies: None (self-contained)
 */

'use client';

export default function PreviewBanner() {
  const exitPreview = () => {
    // Remove preview params from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('preview');
    url.searchParams.delete('secret');
    window.location.href = url.toString();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black py-2 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <p className="font-semibold">
          📝 Preview Mode - Viewing Draft Content
        </p>
        <button
          onClick={exitPreview}
          className="px-4 py-1 bg-black text-white rounded hover:bg-gray-800"
        >
          Exit Preview
        </button>
      </div>
    </div>
  );
}