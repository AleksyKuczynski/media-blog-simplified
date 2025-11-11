// src/main/components/Article/blocks/Blockquote/Type4Blockquote.tsx - SIMPLIFIED
import Image from 'next/image';

interface Type4Props {
  content: string;
  author: string;
  avatarUrl: string;
}

export function Type4Blockquote({ content, author, avatarUrl }: Type4Props) {  
  return (
    <blockquote className="mb-6 px-6 md:mx-8 lg:mx-auto lg:my-12 lg:w-5/6 xl:w-3/4 grid grid-cols-2 pt-6 bg-sf-cont rounded-xl shadow-md">
      
      {avatarUrl && (
        <div className="justify-self-end rounded-2xl shadow-md mr-4 mb-2 relative w-20 h-20 overflow-hidden">
          <Image 
            src={avatarUrl}
            alt=""
            width={80}
            height={80}
            className="h-full w-full object-cover my-0"
          />
        </div>
      )}
      
      <p className="self-center my-0 font-serif font-semibold text-2xl text-on-sf-var">
        {author}
      </p>
      
      <div className="col-span-2 pb-3 text-base font-medium font-serif text-on-sf-var">
        {content.split('\n\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </blockquote>
  );
}