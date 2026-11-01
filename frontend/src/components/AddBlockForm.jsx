// src/pages/editor/components/AddBlockForm.jsx
import React, { useState, useEffect } from 'react';
import { PlusIcon } from './Icons.jsx'; // Adjusted path: Assuming AddBlockForm is perceived in src/components, Icons is also in src/components

/**
 * @file AddBlockForm.jsx
 * @brief A form component for adding new blocks to a page.
 *
 * This component allows users to select an available block type from a dropdown
 * and add it to the current page being edited.
 */

/**
 * @brief Renders a form to add a new block.
 * @param {object} props - The component props.
 * @param {Array<object>} props.allBlocks - An array of all available block definitions.
 * @param {function} props.onAddBlock - Callback function to add the selected block.
 * @returns {JSX.Element} The AddBlockForm component.
 */
const AddBlockForm = ({ allBlocks, onAddBlock }) => {
    // State to hold the ID of the currently selected block in the dropdown
    const [selectedBlockId, setSelectedBlockId] = useState('');

    // Effect to set the default selected block when `allBlocks` changes or on initial load
    useEffect(() => {
        if (allBlocks.length > 0 && !selectedBlockId) {
            setSelectedBlockId(allBlocks[0].id); // Automatically select the first block
        }
    }, [allBlocks, selectedBlockId]); // Re-run if allBlocks or selectedBlockId changes

    /**
     * @brief Handles the form submission.
     * @param {object} e - The event object from the form submission.
     */
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        if (selectedBlockId) {
            onAddBlock(selectedBlockId); // Call the onAddBlock prop with the selected block ID
        }
    };

    return (
        <div className="mt-10 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Add a New Block</h3>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex-grow">
                    <label htmlFor="block-select" className="block text-sm font-medium text-gray-700 mb-1">Block Type</label>
                    <select
                        id="block-select"
                        value={selectedBlockId}
                        onChange={(e) => setSelectedBlockId(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                        disabled={!allBlocks.length} // Disable if no blocks are available
                    >
                        {/* Render options for each available block */}
                        {allBlocks.length > 0 ? (
                            allBlocks.map((block) => (
                                <option key={block.id} value={block.id}>
                                    {block.name} ({block.category})
                                </option>
                            ))
                        ) : (
                            <option>No blocks available</option> // Fallback option
                        )}
                    </select>
                </div>
                <button
                    type="submit"
                    className="flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    disabled={!selectedBlockId} // Disable if no block is selected
                >
                    <PlusIcon />
                    <span className="ml-2">Add Block</span>
                </button>
            </form>
        </div>
    );
};

export default AddBlockForm;
