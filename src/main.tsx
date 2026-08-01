import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { startMockServer } from './msw/server';

startMockServer();

createRoot(document.getElementById('root')!).render(<App />);