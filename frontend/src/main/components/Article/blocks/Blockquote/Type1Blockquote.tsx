// src/main/components/Article/blocks/Blockquote/Type1Blockquote.tsx
interface Type1Props {
  content: string;
}

export function Type1Blockquote({ content }: Type1Props) {
  return (
    <blockquote className="
      relative mb-6 p-6 pt-4 md:mx-8 lg:mx-auto lg:my-12 lg:w-5/6 xl:w-3/4
      rounded-xl shadow-md
      before:content-[''] before:font-display before:text-8xl before:text-pr-cont 
      before:text-start before:absolute
    ">
      <p className="
        text-on-sf-var my-0 pt-12 pb-4
        text-2xl text-center leading-relaxed
        font-semibold font-serif
      ">
        {content}
      </p>
    </blockquote>
  );
}