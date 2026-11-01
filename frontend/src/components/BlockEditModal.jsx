// src/pages/editor/components/BlockEditModal.jsx
import React, { useState, useEffect } from 'react';
import { XMarkIcon } from './Icons.jsx'; // Adjusted path to a direct relative import

/**
 * @file BlockEditModal.jsx
 * @brief A modal component for editing the content of a specific website block.
 *
 * This modal provides a form to allow users to customize the data (e.g., text, URLs)
 * associated with a selected block instance. It dynamically renders input fields
 * based on the block's category (Header, Hero, etc.).
 */

/**
 * @brief Renders a modal for editing block content.
 * @param {object} props - The component props.
 * @param {object} props.block - The block object to be edited, including its content and metadata.
 * @param {function} props.onSave - Callback function to save the updated content.
 * @param {function} props.onClose - Callback function to close the modal.
 * @returns {JSX.Element} The BlockEditModal component.
 */
const BlockEditModal = ({ block, onSave, onClose }) => {
    // Initialize content state with existing block content or an empty object
    const [content, setContent] = useState(block.content || {});
    // Special handling for 'services' which is an array, convert to comma-separated string for input
    const [services, setServices] = useState(Array.isArray(block.content?.services) ? block.content.services.join(', ') : '');

    // Define fields specific to Header and Hero blocks for dynamic rendering
    const headerFields = ['logoUrl', 'companyName', 'phoneNumber', 'emailAddress'];
    const heroFields = ['heading', 'subheading', 'ctaText', 'ctaLink', 'image', 'secondaryCtaText', 'secondaryCtaLink'];

    /**
     * @brief Handles changes in generic input fields.
     * @param {object} e - The event object from the input change.
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContent(prev => ({ ...prev, [name]: value }));
    };

    /**
     * @brief Handles changes in the services input field.
     * @param {object} e - The event object from the input change.
     */
    const handleServicesChange = (e) => setServices(e.target.value);

    /**
     * @brief Handles the form submission.
     * @param {object} e - The event object from the form submission.
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        // Convert services string back to an array before saving
        const updatedContent = {
            ...content,
            services: services.split(',').map(s => s.trim()).filter(Boolean) // Split by comma, trim spaces, remove empty strings
        };
        onSave(updatedContent); // Call the onSave prop with the new content
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative p-8 border w-full max-w-lg shadow-lg rounded-lg bg-white">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Edit Block: {block.name}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700" title="Close"><XMarkIcon /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Render fields specific to Header blocks */}
                    {block.category === 'Header' && (
                        <>
                            <h4 className="text-lg font-semibold text-gray-800 mt-6 border-t pt-4">Header Specific Content</h4>
                            {headerFields.map(field => (
                                <div key={field}>
                                    <label htmlFor={`header-${field}`} className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                                        {field.replace('Url', ' URL').replace(/([A-Z])/g, ' $1')}
                                    </label>
                                    <input
                                        type="text"
                                        id={`header-${field}`}
                                        name={field}
                                        value={content[field] || ''}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            ))}
                            <div>
                                <label htmlFor="header-services" className="block text-sm font-medium text-gray-700 mb-1">Services (comma-separated)</label>
                                <input
                                    type="text"
                                    id="header-services"
                                    value={services}
                                    onChange={handleServicesChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g., Web Design, SEO, Marketing"
                                />
                            </div>
                        </>
                    )}
                    {/* Render fields specific to Hero blocks */}
                    {block.category === 'Hero' && (
                        <>
                            <h4 className="text-lg font-semibold text-gray-800 mt-6 border-t pt-4">Hero Specific Content</h4>
                            {heroFields.map(field => (
                                <div key={field}>
                                    <label htmlFor={`hero-${field}`} className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                                        {field.replace(/([A-Z])/g, ' $1')}
                                    </label>
                                    <input
                                        type="text"
                                        id={`hero-${field}`}
                                        name={field}
                                        value={content[field] || ''}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            ))}
                        </>
                    )}
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BlockEditModal;
