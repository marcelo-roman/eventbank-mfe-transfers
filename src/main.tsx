import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import App from './App';
import { standaloneAuth } from './shared/standaloneAuth';

const root = document.getElementById('root');
if (!root) {
  throw new Error('The #root element is missing.');
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <main className="standalone">
        <Routes>
          <Route path="/pix/*" element={<App auth={standaloneAuth()} />} />
          <Route path="*" element={<Navigate to="/pix" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  </StrictMode>,
);
