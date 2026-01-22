import React from "react";
import { useError } from "./context/ErrorContext";

class ErrorBoundaryInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.props.onError?.(error.message);
  }

  render() {
    return this.props.children;
  }
}

const ErrorBoundary = ({ children }) => {
  const { showError } = useError();

  return (
    <ErrorBoundaryInner onError={showError}>
      {children}
    </ErrorBoundaryInner>
  );
};

export default ErrorBoundary;
