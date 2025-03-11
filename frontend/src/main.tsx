import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import MealPlanner from './pages/MealPlanner';
import AchievementsPage from './pages/AchievementsPage';
import './index.css';
// import { registerServiceWorker } from './utils/registerServiceWorker';
// import apiConnectionService from './services/apiConnectionService';

// Registra il service worker per le funzionalità PWA
// registerServiceWorker();

// Inizializza il servizio di monitoraggio della connessione API
// apiConnectionService.setupApiInterceptors();
// apiConnectionService.startConnectionMonitoring();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
