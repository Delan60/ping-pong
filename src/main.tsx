import React from 'react';
import { createRoot } from 'react-dom/client';
import { Game } from './components';
import './global.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root container missing');
createRoot(container as HTMLElement).render(<Game />);
