import {lazy, StrictMode, Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';

const isAdminRoute = window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/');
const isContentRoute =
  window.location.pathname.startsWith('/blog/') ||
  window.location.pathname.startsWith('/case-study/');
const App = lazy(() => import('./App.tsx'));
const AdminPanel = lazy(() => import('./components/AdminPanel.tsx'));
const ContentPage = lazy(() => import('./components/ContentPage.tsx'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdminRoute ? (
      <Suspense fallback={<div className="min-h-screen bg-[#080c14]" />}>
        <AdminPanel />
      </Suspense>
    ) : isContentRoute ? (
      <Suspense fallback={<div className="min-h-screen bg-[#080c14]" />}>
        <ContentPage />
      </Suspense>
    ) : (
      <Suspense fallback={<div className="min-h-screen bg-[#080c14]" />}>
        <App />
      </Suspense>
    )}
  </StrictMode>,
);
