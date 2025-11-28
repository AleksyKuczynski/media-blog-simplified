// src/app/[lang]/[rubric]/[slug]/_components/navigation/TableOfContents.tsx

import { NAVIGATION_STYLES } from "../article.styles";
import { TableOfContentsLink } from "./TableOfContentsLink";

interface TocItem {
  id: string;
  text: string;
}

interface TableOfContentsProps {
  items: TocItem[];
}

const styles = NAVIGATION_STYLES.tableOfContents;

export function TableOfContents({ items }: TableOfContentsProps) {
  return (
    <nav aria-label="Table of contents">
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <TableOfContentsLink 
              id={item.id}
              className={styles.link}
            >
              {item.text}
            </TableOfContentsLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}