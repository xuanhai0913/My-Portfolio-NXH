import React, { Component } from 'react';
import { useTranslation } from 'react-i18next';

const DefaultErrorFallback = () => {
  const { t } = useTranslation();

  return t('error.generic');
};

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Component Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="error-fallback">
          {this.props.errorMessage || <DefaultErrorFallback />}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
