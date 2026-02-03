import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';
import './index.css';
import { queryClient } from './stores/queryClient.js';
import { ToastProvider } from './components/ui/Toast.jsx';
import { GlobalLoading } from './components/ui/Loading.jsx';
import { initMockDbIfNeeded } from './api/mockDb.js';
import { useUiStore } from './stores/uiStore.js';

initMockDbIfNeeded();

function Root() {
  const theme = useUiStore((s) => s.theme);
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <GlobalLoading />
        <App />
      </ToastProvider>
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
