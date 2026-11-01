// src/pages/editor/Placeholder.jsx (Corrected)
import React from 'react';
import { BlockIcon } from '../../components/Icons.jsx';

function Placeholder({ sectionName }) {
    return (
        <div className="w-full h-48 flex items-center justify-center bg-gray-100 border-y border-dashed border-gray-300">
            <div className="text-center text-gray-400">
                <BlockIcon className="w-10 h-10 mx-auto mb-2" />
                <p className="font-semibold capitalize">{sectionName.replace(/([A-Z])/g, ' $1').trim()} Section</p>
                <p className="text-sm">Select a block to place it here</p>
            </div>
        </div>
    );
}

export default Placeholder;