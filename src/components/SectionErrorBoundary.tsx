'use client';

import React from 'react';

interface State {
  hasError: boolean;
}

/**
 * Wraps a homepage section so a single data/render error can't take down the
 * whole page. Failed sections render nothing rather than crashing.
 */
export default class SectionErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Section failed to render:', error);
    }
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
