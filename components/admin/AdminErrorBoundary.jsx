'use client';
import { Component } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default class AdminErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Admin Error Boundary Caught]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-card p-10 text-center flex flex-col items-center justify-center space-y-4 my-8">
          <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[var(--text-primary)]">Admin Component Error</h3>
            <p className="text-xs text-[var(--text-muted)]">{this.state.error?.message || 'An unexpected error occurred in this admin widget.'}</p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="btn-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
