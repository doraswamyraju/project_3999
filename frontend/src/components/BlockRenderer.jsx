import React, { Suspense, useMemo } from 'react';
import UnknownBlock from './UnknownBlock.jsx';
// REMOVED STATIC IMPORT: The masterRegistry will now be passed as a prop
// import masterRegistry from '../registries/masterRegistry.jsx';
import { useEditor } from '../contexts/EditorContext.jsx';

const getDirectImageUrl = (url) => {
    if (url === 'https://postimg.cc/YG3JfnGf') {
        return 'https://i.postimg.cc/8C4A9V7G/logo.png';
    }
    return url;
};

// --- FIX: The masterRegistry is now consumed from the context ---
const BlockRenderer = ({ blockDef, content, containerScrollTop = 0, previewMode = 'desktop', onAddToCart, isAddedToCart, isPreview = false }) => {
    // Access masterRegistry directly from the context
    const { branding, masterRegistry } = useEditor();

    // Use useMemo to ensure the Component lookup is memoized and only re-runs if blockDef.name changes
    const Component = useMemo(() => {
        // --- FIX: Add a check to ensure masterRegistry is not undefined ---
        if (!masterRegistry) {
            console.error(`masterRegistry is undefined. Cannot render block for "${blockDef.name}".`);
            return UnknownBlock;
        }

        // Use the masterRegistry from the context
        const componentFromRegistry = masterRegistry[blockDef.name];
        if (!componentFromRegistry) {
            console.error(`Component for block name "${blockDef.name}" not found in masterRegistry.`);
            return UnknownBlock; // Return the UnknownBlock component itself, not a JSX element
        }
        return componentFromRegistry;
    }, [blockDef.name, masterRegistry]); // Add masterRegistry to dependency array

    const correctedBranding = {
        ...branding,
        logo_url: getDirectImageUrl(branding?.logo_url)
    };

    const componentProps = {
        ...correctedBranding,
        content,
        previewMode,
        onAddToCart,
        isAddedToCart,
        // --- FIX: Passing down the `isPreview` prop ---
        isPreview, 
    };

    if (['Header', 'Hero', 'About Us'].includes(blockDef.category)) {
        componentProps.containerScrollTop = containerScrollTop;
    }

    return (
        <Suspense fallback={<div className="flex justify-center items-center p-8 text-gray-500">Loading block...</div>}>
            {/* When Component is UnknownBlock, we need to pass a different prop set */}
            {Component === UnknownBlock ? (
                <UnknownBlock blockName={blockDef.name || 'Undefined'} />
            ) : (
                <Component {...componentProps} />
            )}
        </Suspense>
    );
};

export default BlockRenderer;
