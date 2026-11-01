// File: /src/registries/aboutUsRegistry.jsx
// This registry will now dynamically fetch About Us block data from the database.

import React, { lazy } from 'react';

/**
 * Dynamically fetches About Us block data from the backend and returns a populated registry object.
 */
export async function getAboutUsRegistry() {
  const aboutUsRegistry = {};
  try {
    const response = await fetch('http://localhost/project_3999/api/get_blocks.php');
    if (!response.ok) {
      throw new Error('Failed to fetch blocks from the API');
    }
    const result = await response.json();

    if (result.success && result.data) {
      const aboutUsBlocks = result.data.filter(block => block.category && (block.category.toLowerCase() === 'about us' || block.category.toLowerCase() === 'about-us-short'));
      const AboutUsComponents = await import('../components/blocks/about-us-short/index.jsx');

      aboutUsBlocks.forEach(block => {
        const componentName = block.name.replace(/\s/g, ''); 
        
        if (AboutUsComponents[componentName]) {
            // THE FIX: The key for the registry now matches the block name from the database (e.g., "About Us 1").
            aboutUsRegistry[block.name] = lazy(() => Promise.resolve({ default: AboutUsComponents[componentName] }));
        } else {
            console.error(`Component "${componentName}" not found in about-us-short/index.jsx`);
            aboutUsRegistry[block.name] = lazy(() => Promise.resolve({ default: () => <div>Error: Block component "{componentName}" not found.</div> }));
        }
      });
    } else {
      console.error('API response for blocks was not successful:', result.message);
    }
  } catch (error) {
    console.error('Error populating about us registry:', error);
  }
  return aboutUsRegistry;
}

const aboutUsRegistry = {};
export default aboutUsRegistry;
