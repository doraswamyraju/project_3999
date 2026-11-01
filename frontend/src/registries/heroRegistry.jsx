// File: /src/registries/heroRegistry.jsx
// This registry dynamically fetches hero block data from the database.

import React, { lazy } from 'react';

/**
 * Dynamically fetches hero block data from the backend and returns a populated registry object.
 */
export async function getHeroRegistry() {
  const heroRegistry = {};
  try {
    const response = await fetch('http://localhost/project_3999/api/get_blocks.php');
    if (!response.ok) {
      throw new Error('Failed to fetch blocks from the API');
    }
    const result = await response.json();

    if (result.success && result.data) {
      const heroBlocks = result.data.filter(block => block.category && block.category.toLowerCase() === 'hero');
      const HeroComponents = await import('../components/blocks/hero/index.jsx');

      heroBlocks.forEach(block => {
        const componentName = block.name.replace(/\s/g, ''); 
        
        if (HeroComponents[componentName]) {
            // THE FIX: The key for the registry now matches the block name from the database (e.g., "Hero 1").
            heroRegistry[block.name] = lazy(() => Promise.resolve({ default: HeroComponents[componentName] }));
        } else {
            console.error(`Component "${componentName}" not found in hero/index.jsx`);
            heroRegistry[block.name] = lazy(() => Promise.resolve({ default: () => <div>Error: Block component "{componentName}" not found.</div> }));
        }
      });
    } else {
      console.error('API response for blocks was not successful:', result.message);
    }
  } catch (error) {
    console.error('Error populating hero registry:', error);
  }
  return heroRegistry;
}

const heroRegistry = {};
export default heroRegistry;
