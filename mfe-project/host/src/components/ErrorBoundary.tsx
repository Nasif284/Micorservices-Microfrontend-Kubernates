import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  moduleName: string;
}

interface ErrorBoundaryState {
  error: Error | null;
  retryKey: number;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    error: null,
    retryKey: 0,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error, retryKey: 0 };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`The ${this.props.moduleName} micro-frontend failed.`, error, errorInfo);
  }

  handleRetry = () => {
    this.setState((state) => ({
      error: null,
      retryKey: state.retryKey + 1,
    }));
  };

  render() {
    if (this.state.error) {
      return (
        <main className="page">
          <section className="panel error-panel" role="alert">
            <h2>{this.props.moduleName} is temporarily unavailable</h2>
            <p>
              This micro-frontend could not be loaded. The rest of the portal is
              still available.
            </p>
            <button type="button" onClick={this.handleRetry}>
              Try again
            </button>
          </section>
        </main>
      );
    }

    return <React.Fragment key={this.state.retryKey}>{this.props.children}</React.Fragment>;
  }
}
