// app/[lang]/[rubric]/[slug]/_components/content/Table.tsx
/**
 * Article Content - Table Block Component
 * 
 * Server component rendering markdown tables with alignment.
 * Displays structured tabular data with responsive design.
 * 
 * Features:
 * - Column alignment support (left, center, right)
 * - Responsive horizontal scroll
 * - HTML content in cells (bold, italic, links)
 * - Semantic table structure (thead, tbody)
 * 
 * Table Structure:
 * - headers: Array of column headers
 * - rows: Array of row data
 * - alignments: Array of column alignments
 * - caption: Optional table caption
 * 
 * Alignment Classes:
 * - left: text-left
 * - center: text-center
 * - right: text-right
 * - none: text-left (default)
 * 
 * Dependencies:
 * - ../article.styles (BLOCKS_STYLES.table)
 * - ./markdownTypes (TableData)
 * 
 * @param tableData - Structured table data from extractTables
 */

import { twMerge } from 'tailwind-merge';
import { BLOCKS_STYLES } from '../article.styles';
import { TableData } from '../markdown/markdownTypes';

interface TableProps {
  tableData: TableData;
}

const styles = BLOCKS_STYLES.table;

export default function Table({ tableData }: TableProps) {
  const { headers, alignments, rows, processedCaption } = tableData;

  // Get alignment class for a cell
  const getAlignmentClass = (alignment: 'left' | 'center' | 'right' | 'none') => {
    switch (alignment) {
      case 'left': return 'text-left';
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      case 'none': 
      default: return 'text-left';
    }
  };

  return (
    <figure className={styles.wrapper}>
      <div className={styles.container}>
        <table className={styles.table}><thead className={styles.header}><tr>{headers.map((header, index) => (
                <th
                  key={index}
                  className={twMerge(
                    styles.headerCell,
                    getAlignmentClass(alignments[index])
                  )}
                  dangerouslySetInnerHTML={{ __html: header }}
                />
              ))}</tr></thead><tbody>{rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={styles.bodyRow}
              >{row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={twMerge(
                      styles.bodyCell,
                      getAlignmentClass(alignments[cellIndex])
                    )}
                    dangerouslySetInnerHTML={{ __html: cell }}
                  />
                ))}</tr>
            ))}</tbody></table>
      </div>

      {processedCaption && (
        <figcaption 
          className={styles.caption}
          dangerouslySetInnerHTML={{ __html: processedCaption }}
        />
      )}
    </figure>
  );
}