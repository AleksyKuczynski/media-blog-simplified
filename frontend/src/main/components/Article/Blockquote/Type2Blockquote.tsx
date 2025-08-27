// src/main/components/Article/Blockquote/Type2Blockquote.tsx - SIMPLIFIED
import { twMerge } from 'tailwind-merge';

interface Type2Props {
  content: string;
  author: string;
}

export function Type2Blockquote({ content, author }: Type2Props) {
  // Direct rounded theme styling - no more complex theme system
  const containerStyles = twMerge(
    'relative mb-6 p-6 md:mx-8 lg:mx-auto lg:my-12 lg:w-5/6 xl:w-3/4',
    'rounded-xl shadow-md', // Direct rounded theme
    'before:content-["""] before:font-display before:text-8xl before:text-pr-cont',
    'before:text-start before:absolute'
  );

  const contentStyles = twMerge(
    'text-on-sf-var mt-0 mb-4 pt-12', // Direct rounded theme spacing
    'text-xl text-center leading-loose', // Direct rounded theme typography
    'font-medium font-serif'
  );

  const authorStyles = twMerge(
    'text-on-sf-var text-right mb-2',
    'text-base font-medium font-serif' // Direct rounded theme typography
  );
  
  return (
    <blockquote className={containerStyles}>
      <p className={contentStyles}>{content}</p>
      <p className={authorStyles}>— {author}</p>
    </blockquote>
  );
}