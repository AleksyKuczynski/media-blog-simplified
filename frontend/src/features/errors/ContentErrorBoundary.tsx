// src/main/components/errors/ContentErrorBoundary.tsx
'use client';

import React from 'react';
import { getDictionary } from '@/main/lib/dictionary';
import { DEFAULT_LANG } from '@/main/lib/constants/constants';
import StandardError from './StandardError';
import { ContentType } from './lib/errorUtils';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  contentType?: ContentType;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ContentErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Content error boundary:', {
      message: error.message,
      contentType: this.props.contentType,
    });
  }

  render() {
    if (this.state.hasError) {
      // Use DEFAULT_LANG in client component
      const dictionary = getDictionary(DEFAULT_LANG);
      
      return (
        <StandardError 
          dictionary={dictionary}
          contentType={this.props.contentType || 'content'}
          showRetry={true}
          onRetry={() => this.setState({ hasError: false })}
        />
      );
    }

    return this.props.children;
  }
}