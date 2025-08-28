// src/main/components/Article/elements/componentMap.tsx
import React from 'react';
import { ImageFrame } from '../ImageFrame';
import { ArticleHeading } from './Heading';
import { ArticleLink } from './Link';
import { ArticleList } from './List';
import { ListItem } from './ListItem';
import { ArticleParagraph } from './Paragraph';

export const componentMap: Record<string, React.ComponentType<any>> = {
  h1: (props) => <ArticleHeading level={1} {...props} />,
  h2: (props) => <ArticleHeading level={2} {...props} />,
  h3: (props) => <ArticleHeading level={3} {...props} />,
  h4: (props) => <ArticleHeading level={4} {...props} />,
  h5: (props) => <ArticleHeading level={5} {...props} />,
  h6: (props) => <ArticleHeading level={6} {...props} />,
  p: ArticleParagraph,
  ul: (props) => <ArticleList ordered={false} {...props} />,
  ol: (props) => <ArticleList ordered={true} {...props} />,
  li: ListItem,
  a: ArticleLink,
  img: ({ caption, ...props }: React.ComponentProps<typeof ImageFrame> & { caption?: string }) => 
    <ImageFrame {...props} caption={caption} />,
  figure: ({ children }: { children: React.ReactNode }) => <figure className="my-4">{children}</figure>,
  figcaption: ({ children }: { children: React.ReactNode }) => 
    <figcaption className="text-center text-sm mt-2 text-gray-600">{children}</figcaption>,
};