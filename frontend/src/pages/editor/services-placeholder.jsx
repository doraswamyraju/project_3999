// File: /src/pages/editor/Placeholder.jsx
// This component acts as a visual placeholder for the Services section
// in the live preview before a user has chosen a specific block.

import React from 'react';

const ServicesPlaceholder = () => {
  return (
    <div className="flex items-center justify-center h-48 sm:h-64 md:h-80 bg-gray-200 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-400 dark:border-gray-500 text-gray-500 dark:text-gray-400 transition-colors duration-300 p-4">
      <div className="text-center">
        {/* Placeholder SVG Icon for Services */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm font-semibold">Services Section Placeholder</p>
        <p className="text-xs mt-1">Select a block from the marketplace to get started.</p>
      </div>
    </div>
  );
};

export default ServicesPlaceholder;
