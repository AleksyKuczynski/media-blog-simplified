// src/main/components/Article/blocks/Blockquote/Type3Blockquote.tsx - SIMPLIFIED
interface Type3Props {
  content: string;
  author: string;
  source: string;
}

export function Type3Blockquote({ content, author, source }: Type3Props) {
  return (
    <blockquote className="relative mb-6 p-4 pl-12 md:pl-0 md:pr-12 flex flex-col items-end">
      <p className="text-lg font-serif text-on-sf-var mb-4 md:w-1/2">
        {content}
      </p>
      <p className="font-serif font-semibold text-base text-on-sf-var mb-1 md:w-1/2 text-right">
        — {author}
      </p>
      <p className="font-serif text-on-sf-var/80 text-sm mt-0 text-right">
        {source}
      </p>
    </blockquote>
  );
}