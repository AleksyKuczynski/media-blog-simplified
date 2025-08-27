// src/main/components/Article/Blockquote/Type2Blockquote.tsx - SIMPLIFIED
interface Type2Props {
  content: string;
  author: string;
}

export function Type2Blockquote({ content, author }: Type2Props) {
  return (
    <blockquote className="
      relative mb-6 p-6 md:mx-8 lg:mx-auto lg:my-12 lg:w-5/6 xl:w-3/4
      rounded-xl shadow-md
      before:content-[''] before:font-display before:text-8xl before:text-pr-cont
      before:text-start before:absolute
    ">
      <p className="
        text-on-sf-var mt-0 mb-4 pt-12
        text-xl text-center leading-loose
        font-medium font-serif
      ">
        {content}
      </p>
      <p className="
        text-on-sf-var text-right mb-2
        text-base font-medium font-serif
      ">
        — {author}
      </p>
    </blockquote>
  );
}
