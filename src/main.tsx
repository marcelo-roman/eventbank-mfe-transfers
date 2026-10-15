import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import App from './App';

const root = document.getElementById('root');
if (!root) {
  throw new Error('The #root element is missing.');
}

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <main className="standalone">
        <Routes>
          <Route path="/transfers/*" element={<App />} />
          <Route path="*" element={<Navigate to="/transfers" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  </StrictMode>,
);
