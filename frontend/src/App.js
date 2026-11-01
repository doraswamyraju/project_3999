// src/App.jsx
import React from 'react';
import { BrandingProvider } from './contexts/BrandingContext.jsx';
// --- NEW --- Import the EditorProvider
import { EditorProvider } from './contexts/EditorContext.jsx'; 
import AppContent from './pages/dashboard/AppContent.jsx';
import './styles/globals.css';

/**
 * @file App.jsx
 * @brief The root component of the entire React application.
 */

/**
 * @brief The main application component.
 * @returns {JSX.Element} The root App component.
 */
function App() {
    return (
        // --- CORRECTED NESTING ---
        // 1. BrandingProvider fetches the data first.
        <BrandingProvider>
            {/* 2. EditorProvider is nested inside, so it can access the branding data
                   once it's loaded. */}
            <EditorProvider>
                {/* 3. AppContent renders last, with access to both contexts. */}
                <AppContent />
            </EditorProvider>
        </BrandingProvider>
    );
}

export default App;
