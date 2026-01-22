import React, { Suspense, useEffect } from "react";
import { HashRouter, useRoutes } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./services/store";
import Loader from "./layouts/loader/Loader";
import Themeroutes from "./routes/Router";
import "./i18n";

import { ErrorProvider } from "./context/ErrorContext";
import GlobalErrorHandler from "./GlobalErrorHandler";
import ErrorPopup from "./ErrorPopup";
import ErrorBoundary from "./ErrorBoundary";

const AppRoutes = () => {
  const routes = useRoutes(Themeroutes);
  return routes;
};

const App = () => {
  useEffect(() => {
    if (window.top !== window.self) {
      window.top.location = window.self.location;
    }
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ErrorProvider>
            <HashRouter>
              <GlobalErrorHandler />
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
              <ErrorPopup />
            </HashRouter>
          </ErrorProvider>
        </PersistGate>
      </Provider>
    </Suspense>
  );
};

export default App;
