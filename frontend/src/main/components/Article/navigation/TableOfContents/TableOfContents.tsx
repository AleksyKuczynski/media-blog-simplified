// src/main/components/Article/TableOfContents.tsx

import { TableOfContentsLink } from "./TableOfContentsLink";

interface TocItem {
  id: string;
  text: string;
}

interface TableOfContentsProps {
  items: TocItem[];
  title: string;
}

export function TableOfContents({ items, title }: TableOfContentsProps) {
  return (
    <nav aria-label="Table of contents" className="
      w-full max-w-2xl mx-auto mb-16
      bg-sf-cont p-8 rounded-2xl shadow-lg
    ">
      <h2 className="
        text-xl font-bold mb-4 text-on-sf-var
        bg-sf-hst py-3 px-6 rounded-lg shadow-sm
      ">
        {title}
      </h2>
      <ul className="space-y-2 pl-6">
        {items.map((item) => (
          <li key={item.id}>
            <TableOfContentsLink 
              id={item.id}
              className="
                block text-pr-cont hover:text-pr-fix 
                transition-colors duration-200 py-1
              "
            >
              {item.text}
            </TableOfContentsLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}