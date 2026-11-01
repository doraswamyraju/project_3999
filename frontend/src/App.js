// src/App.js
import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BrandingProvider } from './contexts/BrandingContext.jsx';
import { EditorProvider } from './contexts/EditorContext.jsx';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import AppContent from './pages/dashboard/AppContent.jsx';
import './styles/globals.css';

function MainRouter() {
    const { user, isAdmin } = useAuth();

    if (!user) {
        return <Login />;
    }

    if (isAdmin) {
        return <AdminDashboard />;
    }

    return (
        <BrandingProvider>
            <EditorProvider>
                <AppContent />
            </EditorProvider>
        </BrandingProvider>
    );
}

function App() {
    return (
        <AuthProvider>
            <MainRouter />
        </AuthProvider>
    );
}

export default App;
