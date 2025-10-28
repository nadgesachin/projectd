import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import { store, persistor } from './app/store';
import AppRoutes from './routes/AppRoutes';
import Loader from './components/common/Loader';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loader fullScreen text="Loading ThriveUnity..." />} persistor={persistor}>
        <HelmetProvider>
          <BrowserRouter>
            <div className="App">
              <AppRoutes />
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </div>
          </BrowserRouter>
        </HelmetProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
