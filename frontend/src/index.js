// src/index.js - Exportable module entry point
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 1. Standalone web app execution (http://localhost:3000)
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// 2. Exportable Module for ManaCity or other host applications:
// import { WebsiteBuilder } from 'project_3999';
// <WebsiteBuilder tenantData={manacityProfileAndCatalog} onSave={handleSave} onPublish={handlePublish} />
export { default as WebsiteBuilder } from './module/WebsiteBuilder';
