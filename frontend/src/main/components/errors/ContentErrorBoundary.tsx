// src/components/errors/ContentErrorBoundary.tsx
'use client';

import React from 'react';
import dictionary from '@/main/lib/dictionary/dictionary'; // Direct import
import StandardError from '@/main/components/errors/StandardError';
import { ContentType } from '@/main/lib/errors/errorUtils';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  contentType?: ContentType;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Simple error boundary with direct dictionary access
 */
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