// src/components/AlertDialog.jsx
import React from 'react';
import { XMarkIcon } from './Icons.jsx'; // Assuming Icons.jsx is in the same components directory

/**
 * @file AlertDialog.jsx
 * @brief A reusable alert dialog component for displaying messages.
 *
 * This component provides a modal dialog to show informational messages to the user.
 * It replaces the use of `alert()` for a better user experience within the application.
 */

/**
 * @brief Renders an alert dialog.
 * @param {object} props - The component props.
 * @param {string|null} props.message - The message to display. If null, the dialog is hidden.
 * @param {function} props.onClose - Callback function when the dialog is closed.
 * @returns {JSX.Element|null} The AlertDialog component or null if no message.
 */
const AlertDialog = ({ message, onClose }) => {
    if (!message) return null; // Don't render if no message

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Notification</h3>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md w-auto shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertDialog;
