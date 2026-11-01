import React from 'react';
import { useEditor } from '../../contexts/EditorContext.jsx';

// --- ICONS (FIXED SVG CODE) ---
const RestoreIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639l4.43-7.087a1.012 1.012 0 011.586 0l4.43 7.087c.23.368.23.882 0 1.25l-4.43 7.087a1.012 1.012 0 01-1.586 0l-4.43-7.087zM12 9a3 3 0 100 6 3 3 0 000-6z" /></svg>;
const EyeSlashIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" /></svg>;

const HiddenBlocksManager = ({ hiddenBlocks }) => {
    const { toggleBlockVisibility } = useEditor();

    const handleRestoreBlock = async (blockId) => {
        await toggleBlockVisibility(blockId, 1); // 1 for visible
    };

    return (
        <div className="mt-12 p-6 bg-gray-800 text-white rounded-lg shadow-2xl border-t-4 border-amber-500">
            <h3 className="text-2xl font-bold mb-4 border-b border-gray-600 pb-2">Restore Hidden Blocks (Admin)</h3>
            <p className="text-sm text-gray-400 mb-6">These blocks are currently hidden from users. Click "Restore" to make them visible again.</p>
            
            {(!hiddenBlocks || hiddenBlocks.length === 0) ? (
                <div className="text-center text-gray-400 py-4">
                    <EyeSlashIcon className="mx-auto h-8 w-8" />
                    <p className="mt-2 text-sm">There are currently no hidden blocks in this section.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {hiddenBlocks.map(block => (
                        <div key={block.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-md">
                            <span className="font-medium">{block.name}</span>
                            <button
                                onClick={() => handleRestoreBlock(block.id)}
                                className="flex items-center px-4 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 transition-colors"
                            >
                                <RestoreIcon className="w-4 h-4 mr-2" />
                                Restore
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HiddenBlocksManager;