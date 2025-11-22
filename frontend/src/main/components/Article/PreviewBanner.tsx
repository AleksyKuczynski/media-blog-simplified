// frontend/src/main/components/Article/PreviewBanner.tsx
'use client';

import { Dictionary } from "@/main/lib/dictionary";

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