import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import LibraryPage from './pages/LibraryPage';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './components/layout.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LibraryPage />
  </StrictMode>,
);
