import { useEffect } from "react";
import { useError } from "./context/ErrorContext";

const GlobalErrorHandler = () => {
  const { showError } = useError();

  useEffect(() => {
    const handleGlobalError = (event) => {
      showError(event.message || "An unexpected error occurred.");
    };

    const handlePromiseRejection = (event) => {
      showError(event.reason?.message || "Unhandled promise rejection.");
    };

    window.addEventListener("error", handleGlobalError);
    window.addEventListener("unhandledrejection", handlePromiseRejection);

    return () => {
      window.removeEventListener("error", handleGlobalError);
      window.removeEventListener("unhandledrejection", handlePromiseRejection);
    };
  }, [showError]);

  return null;
};

export default GlobalErrorHandler;
