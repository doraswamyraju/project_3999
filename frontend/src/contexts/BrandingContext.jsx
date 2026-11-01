// src/contexts/BrandingContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import Spinner from '../components/Spinner.jsx';

/**
 * @file BrandingContext.jsx
 * @brief Provides global branding data (logo, company name, color) to the application.
 */

export const BrandingContext = createContext(null);

export const BrandingProvider = ({ children }) => {
    const [branding, setBranding] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBrandingData = async () => {
            try {
                // --- CORRECTED API ENDPOINT ---
                // The URL now points to the full path of your PHP script on your local server.
                const response = await fetch('http://localhost/project_3999/api/get_user_data.php');
                if (!response.ok) {
                    throw new Error(`Network response was not ok (${response.status})`);
                }
                const result = await response.json();
                if (result.success) {
                    setBranding(result.data);
                } else {
                    throw new Error(result.message || 'Failed to fetch branding data');
                }
            } catch (err) {
                setError(err.message);
                console.error("Branding fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBrandingData();
    }, []); // Empty dependency array means this effect runs once on mount

    if (isLoading) {
        return (
            <div className="h-screen bg-gray-100 flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen bg-red-100 flex items-center justify-center text-red-700 p-8 text-center">
                <strong>Critical Error:</strong><br/>Could not load user branding data.<br/><small>Details: {error}</small>
            </div>
        );
    }

    return (
        <BrandingContext.Provider value={branding}>
            {children}
        </BrandingContext.Provider>
    );
};

/**
 * @brief Custom hook to easily consume branding data from the context.
 */
export const useBranding = () => {
    const context = useContext(BrandingContext);
    if (context === undefined) {
        throw new Error('useBranding must be used within a BrandingProvider');
    }
    return context;
};
