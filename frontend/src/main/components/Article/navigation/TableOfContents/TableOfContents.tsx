// src/main/components/Article/TableOfContents.tsx

import { NAVIGATION_STYLES } from "../../styles";
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
    <nav aria-label="Table of contents" className={NAVIGATION_STYLES.tableOfContents.container}>
      <h2 className={NAVIGATION_STYLES.tableOfContents.title}>
        {title}
      </h2>
      <ul className={NAVIGATION_STYLES.tableOfContents.list}>
        {items.map((item) => (
          <li key={item.id}>
            <TableOfContentsLink 
              id={item.id}
              className={NAVIGATION_STYLES.tableOfContents.link}
            >
              {item.text}
            </TableOfContentsLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}