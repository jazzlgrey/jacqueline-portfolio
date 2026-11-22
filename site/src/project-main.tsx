import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ProjectPage from './pages/ProjectPage';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './components/layout.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProjectPage />
  </StrictMode>,
);
