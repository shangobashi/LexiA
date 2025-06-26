import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './lib/fonts.css';
import './index.css';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './contexts/auth-context';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <App />
        <Toaster />
      </AuthProvider>
    </HashRouter>
  </StrictMode>
);