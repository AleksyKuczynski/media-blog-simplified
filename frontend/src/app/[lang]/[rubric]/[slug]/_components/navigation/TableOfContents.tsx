// app/[lang]/[rubric]/[slug]/_components/navigation/TableOfContents.tsx
/**
 * Article Navigation - Table of Contents
 * 
 * Client component that displays heading hierarchy as clickable links.
 * Smooth scrolls to heading anchors on click.
 * 
 * Features:
 * - Hierarchical structure (h2, h3, h4)
 * - Smooth scroll behavior
 * - Active state highlighting
 * - Mobile-friendly collapsible (via parent Collapsible)
 * 
 * Dependencies:
 * - article.styles.ts (NAVIGATION_STYLES.tableOfContents)
 * - markdown/generateToc.ts (TOC item structure)
 * 
 * @param items - TOC items from processContent()
 */

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