import { Component, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';

// Separate component for handling Privy errors
const PrivyErrorListener = () => {
  const { logout } = usePrivy();

  useEffect(() => {
    const handleAuthErrors = (event) => {
      if (event.detail?.error?.code === 'SESSION_EXPIRED') {
        logout();
      }
    };

    window.addEventListener('privy:error', handleAuthErrors);
    return () => window.removeEventListener('privy:error', handleAuthErrors);
  }, [logout]);

  return null;
};

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    return (
      <>
        <PrivyErrorListener />
        {this.props.children}
      </>
    );
  }
}

export default ErrorBoundary;