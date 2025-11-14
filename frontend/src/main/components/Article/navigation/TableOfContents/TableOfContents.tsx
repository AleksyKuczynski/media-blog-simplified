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

const styles = NAVIGATION_STYLES.tableOfContents;

export function TableOfContents({ items, title }: TableOfContentsProps) {
  return (
    <nav aria-label="Table of contents" className={styles.container}>
      <h2 className={styles.title}>
        {title}
      </h2>
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