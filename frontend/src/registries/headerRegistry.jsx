// File: /src/registries/headerRegistry.jsx
// This registry dynamically fetches header block data from the backend.

import React, { lazy } from 'react';

/**
 * Dynamically fetches header block data from the backend and returns a populated registry object.
 */
export async function getHeadersRegistry() {
  const headerRegistry = {};
  try {
    const response = await fetch('http://localhost/project_3999/api/get_blocks.php');
    if (!response.ok) {
      throw new Error('Failed to fetch blocks from the API');
    }
    const result = await response.json();

    if (result.success && result.data) {
      // Filter for blocks in the 'Header' category.
      const headerBlocks = result.data.filter(block => block.category && (block.category.toLowerCase() === 'headers' || block.category.toLowerCase() === 'header'));

      // *** THE FIX IS HERE ***
      // The path is corrected from '../../' to '../' to correctly locate the components directory from the registries directory.
      const HeadersComponents = await import('../components/blocks/headers/index.jsx');

      headerBlocks.forEach(block => {
        // This is the component name as exported from index.jsx (e.g., "Header1").
        const componentName = block.name.replace(/\s/g, ''); 
        
        // Check if the component exists in the imported module.
        if (HeadersComponents[componentName]) {
            // The key for the registry now matches the block name from the 
            // database (e.g., "Header 1"), which is what BlockRenderer uses for lookups.
            headerRegistry[block.name] = lazy(() => Promise.resolve({ default: HeadersComponents[componentName] }));
        } else {
            console.error(`Component "${componentName}" not found in headers/index.jsx`);
            // Ensure fallback also uses the correct key for consistent error handling.
            headerRegistry[block.name] = lazy(() => Promise.resolve({ default: () => <div>Error: Block component "{componentName}" not found.</div> }));
        }
      });
    } else {
      console.error('API response for blocks was not successful:', result.message);
    }
  } catch (error) {
    console.error('Error populating header registry:', error);
  }
  return headerRegistry;
}

// Export a default empty object to avoid import errors before it's populated.
const headerRegistry = {};
export default headerRegistry;
