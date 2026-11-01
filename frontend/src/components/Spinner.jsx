// src/components/Spinner.jsx
import React from 'react';

/**
 * @file Spinner.jsx
 * @brief A simple loading spinner component.
 *
 * This component displays a basic animated spinner, typically used to indicate
 * a loading state to the user.
 */

/**
 * @brief Renders a loading spinner.
 * @returns {JSX.Element} The Spinner component.
 */
const Spinner = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
);

export default Spinner;
