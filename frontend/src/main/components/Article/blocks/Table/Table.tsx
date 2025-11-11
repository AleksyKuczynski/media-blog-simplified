// src/main/components/Article/blocks/Table.tsx
import React from 'react';
import { TableData } from '@/main/lib/markdown/markdownTypes';
import { twMerge } from 'tailwind-merge';

interface TableProps {
  tableData: TableData;
  className?: string;
}

export default function Table({ tableData, className }: TableProps) {
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
    <figure className={twMerge('not-prose my-8', className)}>
      <div className="overflow-x-auto rounded-lg shadow-sm theme-default:bg-sf/50 theme-rounded:bg-sf/60 theme-rounded:rounded-xl theme-sharp:bg-sf theme-sharp:border theme-sharp:border-ol">
        <table className="w-full min-w-full border-collapse"><thead className="theme-default:bg-sf/80 theme-rounded:bg-sf/90 theme-sharp:bg-sf theme-sharp:border-b theme-sharp:border-ol"><tr>{headers.map((header, index) => (
                <th
                  key={index}
                  className={twMerge(
                    'px-4 py-3',
                    'font-semibold text-sm',
                    'text-on-sf',
                    'border-b border-ol/20',
                    'theme-default:first:rounded-tl-lg theme-default:last:rounded-tr-lg',
                    'theme-rounded:first:rounded-tl-xl theme-rounded:last:rounded-tr-xl',
                    getAlignmentClass(alignments[index])
                  )}
                  dangerouslySetInnerHTML={{ __html: header }}
                />
              ))}</tr></thead><tbody>{rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="transition-colors duration-150 hover:bg-sf/60 theme-sharp:border-b theme-sharp:border-ol/10 last:theme-sharp:border-b-0"
              >{row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={twMerge(
                      'px-4 py-3',
                      'text-sm text-on-sf/90',
                      'border-b border-ol/10 last:border-b-0',
                      getAlignmentClass(alignments[cellIndex])
                    )}
                    dangerouslySetInnerHTML={{ __html: cell }}
                  />
                ))}</tr>
            ))}</tbody></table>
      </div>

      {processedCaption && (
        <figcaption 
          className="mt-3 px-2 text-sm text-on-sf/70 text-center theme-default:italic theme-rounded:italic theme-rounded:text-xs theme-sharp:font-mono theme-sharp:text-xs"
          dangerouslySetInnerHTML={{ __html: processedCaption }}
        />
      )}
    </figure>
  );
}