// src/module/WebsiteBuilder.jsx
import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { TenantProvider } from '../contexts/TenantContext';
import { EditorProvider } from '../contexts/EditorContext';
import AppContent from '../pages/dashboard/AppContent';
import '../styles/globals.css';

/**
 * Embeddable WebsiteBuilder Component for ManaCity
 * 
 * @param {object} tenantData - { business: { name, logoUrl, brandColor, phone, email, address, ownerPhoto }, services: [...], products: [...] }
 * @param {function} onSave - Callback receiving final site structure
 * @param {function} onPublish - Callback when user publishes website
 */
export default function WebsiteBuilder({ tenantData, onSave, onPublish }) {
    return (
        <AuthProvider>
            <TenantProvider initialTenantData={tenantData}>
                <EditorProvider>
                    <div className="manacity-website-builder-root w-full h-full min-h-screen">
                        <AppContent onSave={onSave} onPublish={onPublish} />
                    </div>
                </EditorProvider>
            </TenantProvider>
        </AuthProvider>
    );
}
