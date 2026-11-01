// src/components/UnknownBlock.jsx
import React from 'react';

/**
 * @file UnknownBlock.jsx
 * @brief A fallback component displayed when a requested block component cannot be found.
 *
 * This component helps in debugging by clearly indicating when a block definition
 * does not map to an existing or loaded React component.
 */

/**
 * @brief Renders an error message for an unknown block.
 * @param {object} props - The component props.
 * @param {string} props.blockName - The name of the block that could not be found.
 * @returns {JSX.Element} The UnknownBlock component.
 */
const UnknownBlock = ({ blockName }) => (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p className="font-bold">Error: Unknown Block</p>
        <p>The component for block "<strong>{blockName}</strong>" is not registered or failed to load.</p>
    </div>
);

export default UnknownBlock;
