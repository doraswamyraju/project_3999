// src/contexts/TenantContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import Spinner from '../components/Spinner.jsx';
import { useAuth } from './AuthContext';

/**
 * TenantContext provides customer profile data (business details, contact, logo)
 * and their products & services catalog.
 * Supports both standalone mode (via API) and embedded mode in host apps (via props).
 */
export const TenantContext = createContext(null);

export const useTenant = () => {
    const context = useContext(TenantContext);
    if (!context) throw new Error('useTenant must be used within a TenantProvider');
    return context;
};

export const TenantProvider = ({ children, initialTenantData }) => {
    const { user } = useAuth();
    const [tenantData, setTenantData] = useState(initialTenantData || null);
    const [isLoading, setIsLoading] = useState(!initialTenantData);
    const [error, setError] = useState(null);

    useEffect(() => {
        // If data is provided by host application via props, use it directly!
        if (initialTenantData) {
            setTenantData(initialTenantData);
            setIsLoading(false);
            return;
        }

        const fetchTenantData = async () => {
            setIsLoading(true);
            try {
                const userId = user?.id || 1;
                const res = await fetch(`http://localhost/project_3999/api/get_tenant_profile.php?user_id=${userId}`);
                const result = await res.json();

                if (result.success && result.data) {
                    setTenantData(result.data);
                } else {
                    throw new Error(result.message || 'Failed to load tenant data');
                }
            } catch (err) {
                console.warn('Could not load tenant data from API, using fallback:', err.message);
                // Resilient fallback defaults
                setTenantData({
                    business: {
                        name: user?.business_name || 'My ManaCity Business',
                        tagline: 'Leading products & services in your city',
                        logoUrl: 'http://localhost:3000/logo.png',
                        brandColor: '#4f46e5',
                        email: user?.email || 'contact@manacity.in',
                        phone: '+91 80085 30606',
                        whatsapp: '+918008530606',
                        address: 'Tirupati, AP',
                        ownerPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'
                    },
                    services: [
                        { id: 1, title: 'Premium Business Service', description: 'Tailored solutions for local and growing business needs.', price: 4999, icon: 'Briefcase' }
                    ],
                    products: [
                        { id: 1, name: 'Featured Product', description: 'High quality product available locally.', price: 1999, image_url: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=600' }
                    ]
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchTenantData();
    }, [initialTenantData, user]);

    if (isLoading) {
        return (
            <div className="h-screen bg-gray-100 flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <TenantContext.Provider value={{ tenantData, setTenantData, business: tenantData?.business, services: tenantData?.services || [], products: tenantData?.products || [] }}>
            {children}
        </TenantContext.Provider>
    );
};
