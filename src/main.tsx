import {lazy, StrictMode, Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const isAdminRoute = window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/');
const AdminPanel = lazy(() => import('./components/AdminPanel.tsx'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdminRoute ? (
      <Suspense fallback={<div className="min-h-screen bg-[#080c14]" />}>
        <AdminPanel />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
);
