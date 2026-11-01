// File: /src/registries/servicesRegistry.jsx
// This registry dynamically fetches service block data from the database.

import React, { lazy } from 'react';

/**
 * Dynamically fetches service block data from the backend and returns a populated registry object.
 */
export async function getServicesRegistry() {
  const servicesRegistry = {};
  try {
    const response = await fetch('http://localhost/project_3999/api/get_blocks.php');
    if (!response.ok) {
      throw new Error('Failed to fetch blocks from the API');
    }
    const result = await response.json();

    if (result.success && result.data) {
      // THE FIX: Convert the category from the database to lowercase before comparing.
      // This makes the check case-insensitive ('Services' or 'services' will now work).
      const servicesBlocks = result.data.filter(block => block.category.toLowerCase() === 'services');
      
      const ServicesComponents = await import('../components/blocks/services/index.jsx');

      servicesBlocks.forEach(block => {
        const componentName = block.name.replace(/\s/g, ''); 
        
        if (ServicesComponents[componentName]) {
            servicesRegistry[block.name] = lazy(() => Promise.resolve({ default: ServicesComponents[componentName] }));
        } else {
            console.error(`Component "${componentName}" not found in services/index.jsx`);
            servicesRegistry[block.name] = lazy(() => Promise.resolve({ default: () => <div>Error: Block component "{componentName}" not found.</div> }));
        }
      });
    } else {
      console.error('API response for blocks was not successful:', result.message);
    }
  } catch (error) {
    console.error('Error populating services registry:', error);
  }
  return servicesRegistry;
}

const servicesRegistry = {};
export default servicesRegistry;
