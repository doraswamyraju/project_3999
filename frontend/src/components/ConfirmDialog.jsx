// src/components/ConfirmDialog.jsx
import React from 'react';

/**
 * @file ConfirmDialog.jsx
 * @brief A reusable confirmation dialog component.
 *
 * This component provides a modal dialog to ask for user confirmation before
 * performing a destructive or irreversible action. It replaces the use of `confirm()`.
 */

/**
 * @brief Renders a confirmation dialog.
 * @param {object} props - The component props.
 * @param {string|null} props.message - The confirmation message to display. If null, the dialog is hidden.
 * @param {function} props.onConfirm - Callback function when the user confirms the action.
 * @param {function} props.onCancel - Callback function when the user cancels the action.
 * @returns {JSX.Element|null} The ConfirmDialog component or null if no message.
 */
const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
    if (!message) return null; // Don't render if no message

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Action</h3>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-auto shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-auto shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
