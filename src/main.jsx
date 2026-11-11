import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/base.css';
import './styles/exploration.css';
import './styles/timeline.css';
import './styles/research.css';

createRoot(document.getElementById('root')).render(<App />);
