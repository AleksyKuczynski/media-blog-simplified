// src/app/[lang]/search/layout.tsx
import { ReactNode } from 'react';

export default function SearchLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="pt-16 xl:pt-24">
      {children}
    </div>
  );
}