// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Use createRoot for React 18+
import App from './App.js'; // Corrected: Import App.js instead of App.jsx
import './styles/globals.css'; // Import global CSS (e.g., for Tailwind base styles)

/**
 * @file index.js
 * @brief The absolute entry point of the React application.
 *
 * This file is responsible for rendering the root React component (`App`)
 * into the HTML Document Object Model (DOM). It also imports global styles.
 */

// Get the root DOM element where the React app will be mounted
const rootElement = document.getElementById('root');

// Create a React 18+ root and render the App component
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
