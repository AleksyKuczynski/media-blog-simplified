// src/main/lib/dictionary/types.ts

// ===================================================================
// UTILITY TYPES
// ===================================================================

export type SEOPageType = 'home' | 'article' | 'rubric' | 'author' | 'search' | 'collection';

export interface TemplateVariables {
  readonly siteName?: string;
  readonly title?: string;
  readonly page?: string;
  readonly section?: string;
  readonly collection?: string;
  readonly item?: string;
  readonly items?: string;
  readonly author?: string;
  readonly query?: string;
  readonly count?: string;
  readonly countLabel?: string;
  readonly action?: string;
  readonly description?: string;
  readonly year?: string;
  readonly name?: string;
  readonly contentType?: string; 
  readonly minutes?: string;     
  readonly rubric?: string;      
}

export type TemplateProcessor = (template: string, variables: TemplateVariables) => string;