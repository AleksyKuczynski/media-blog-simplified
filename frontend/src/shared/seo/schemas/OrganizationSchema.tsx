// shared/seo/schemas/OrganizationSchema.tsx
import React from 'react';
import { Dictionary } from '@/config/i18n';
import { SchemaBuilder, createStandardOrganizationSchema } from '../core/SchemaBuilder';

export interface OrganizationSchemaProps {
  readonly dictionary: Dictionary;
  readonly contactType?: 'editorial' | 'customer support';
}

/**
 * Standalone Organization schema for footer and other contexts
 * Uses standardized organization schema from SchemaBuilder
 */
export const OrganizationSchema: React.FC<OrganizationSchemaProps> = ({ 
  dictionary,
  contactType = 'customer support'
}) => {
  try {
    const schema = createStandardOrganizationSchema(dictionary, contactType);

    return (
      <SchemaBuilder
        schema={schema}
        dictionary={dictionary}
        priority="high"
        enableValidation={true}
        enableOptimization={true}
      />
    );
    
  } catch (error) {
    console.error('OrganizationSchema: Error generating schema', error);
    return null;
  }
};

export default OrganizationSchema;