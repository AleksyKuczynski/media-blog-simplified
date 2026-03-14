'use client';

import { useState } from 'react';

interface Tab {
  lang: string;
  content: React.ReactNode;
}

export default function PreviewTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);

  if (tabs.length === 1) return <>{tabs[0].content}</>;

  return (
    <div>
      <div className="sticky top-0 z-10 my-3 flex border-b border-pr-cont bg-sf">
        {tabs.map((tab, i) => (
          <button
            key={tab.lang}
            onClick={() => setActive(i)}
            className={`px-6 py-3 text-sm font-semibold uppercase tracking-widest transition-colors ${
              active === i
                ? 'text-sf bg-pr-cont'
                : 'text-pr-cont hover:text-pr-var'
            }`}
          >
            {tab.lang}
          </button>
        ))}
      </div>
      <div>{tabs[active].content}</div>
    </div>
  );
}