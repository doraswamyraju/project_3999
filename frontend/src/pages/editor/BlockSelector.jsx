// src/pages/editor/components/BlockSelector.jsx (Revised)

import React, { useMemo, useRef } from 'react';
import { useEditor } from '../../contexts/EditorContext.jsx';
import BlockRenderer from '../../components/BlockRenderer.jsx';
import Spinner from '../../components/Spinner.jsx';
import SectionNavbar from './SectionNavbar.jsx';
import FocusCustomizer from './FocusCustomizer.jsx';

// (Icons and FilterBar remain unchanged)
const SearchIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>;
const SelectIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;
const CustomizeIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a15.998 15.998 0 001.622-3.385m3.388 1.62a15.998 15.998 0 00-1.622-3.385m-5.043-.025a15.998 15.998 0 01-3.388-1.621m7.702 7.702a15.998 15.998 0 00-3.388-1.622m-5.043-.025a15.998 15.998 0 011.622-3.385m3.388 1.62a15.998 15.998 0 00-1.622-3.385m-5.043-.025a15.998 15.998 0 01-3.388-1.621m2.02 14.42a15.998 15.998 0 01-.995-1.18m1.622 3.385a15.998 15.998 0 01-3.388-1.621m7.702 7.702a15.998 15.998 0 003.388-1.622m-5.043-.025a15.998 15.998 0 011.622-3.385m3.388 1.62a15.998 15.998 0 00-1.622-3.385m-5.043-.025a15.998 15.998 0 01-3.388-1.621" /></svg>;
const AddToCartIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.821-6.831a1.5 1.5 0 00-1.087-1.835H4.832" /></svg>;
const AddIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;

const FilterBar = ({ onSkip }) => (
    <div className="p-4 bg-white rounded-xl shadow-md border border-gray-200 mb-8 sticky top-0 z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="relative md:col-span-4">
                <input type="text" placeholder="Search blocks..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <div className="md:col-span-3"><select className="w-full py-2 px-4 border rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500"><option>Filter by Style (Dummy)</option></select></div>
            <div className="md:col-span-3"><select className="w-full py-2 px-4 border rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500"><option>Filter by Feature (Dummy)</option></select></div>
            <div className="md:col-span-2"><button onClick={onSkip} className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">Skip Section</button></div>
        </div>
    </div>
);

// (BlockPreviewCard remains unchanged)
const BlockPreviewCard = ({ blockDef, onSelect, onAddToCart, onCustomize }) => {
    const isHeaderPreview = blockDef.category.toLowerCase() === 'header';
    const scrollContainerRef = useRef(null);
    const [containerScrollTop, setContainerScrollTop] = React.useState(0);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            setContainerScrollTop(scrollContainerRef.current.scrollTop);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-indigo-300 flex flex-col">
            <div className="p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 text-lg">{blockDef.name}</h3>
                <button onClick={() => onSelect(blockDef)} className="flex items-center text-sm px-3 py-1.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-sm" title="Select this block to preview it on the right">
                    <SelectIcon className="w-4 h-4 mr-1.5" /> Select
                </button>
            </div>
            
            <div className="relative h-96 border-b border-gray-200 bg-gray-100">
                {isHeaderPreview ? (
                    <div ref={scrollContainerRef} onScroll={handleScroll} className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
                        <div className="h-48" /> 
                        {/* BlockRenderer in a card uses default content since it's a selection preview */}
                        <BlockRenderer blockDef={blockDef} containerScrollTop={containerScrollTop} />
                        <div className="h-[600px] flex items-center justify-center p-4">
                            <p className="text-gray-400 text-center font-medium">Scroll up to see the header's sticky effect.</p>
                        </div>
                    </div>
                ) : (
                    <div className="h-full w-full overflow-y-auto scrollbar-thin">
                        {/* BlockRenderer in a card uses default content since it's a selection preview */}
                        <BlockRenderer blockDef={blockDef} />
                    </div>
                )}
            </div>

            <div className="p-3 bg-gray-50 flex justify-end items-center space-x-3">
                <button onClick={() => onCustomize(blockDef)} className="flex items-center text-sm px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors shadow-sm">
                    <CustomizeIcon className="w-4 h-4 mr-2" /> Customize
                </button>
                <button onClick={() => onAddToCart(blockDef)} className="flex items-center text-sm px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
                   <AddToCartIcon className="w-4 h-4 mr-2" /> Add to Cart
                </button>
            </div>
        </div>
    );
};

const AddBlockSection = ({ blocks, onAdd, title }) => (
    <div className="mt-12 p-6 bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-lg shadow-2xl border-t-4 border-indigo-500">
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-sm text-gray-300 mb-6">Select a block from the dropdown to add it to the page body.</p>
        <div className="flex items-center space-x-4 p-4 bg-gray-900/50 rounded-lg">
            <select id="add-block-select" className="flex-grow bg-gray-200 text-gray-800 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3">
                <option value="">Select a block to add...</option>
                {blocks.map(block => ( <option key={block.id} value={block.id}>{block.name}</option> ))}
            </select>
            <button 
                onClick={() => {
                    const select = document.getElementById('add-block-select');
                    if (select.value) {
                        const selectedBlock = blocks.find(b => b.id.toString() === select.value);
                        if (selectedBlock) onAdd(selectedBlock);
                    }
                }}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
                <AddIcon className="w-5 h-5 mr-2" /> Add
            </button>
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">{blocks.length} block types available for this section.</p>
    </div>
);

function BlockSelector() {
    const { 
        allBlocks, isInitialLoading, currentSection, isInFocusMode, pageStructure, masterRegistry,
        selectBlockForSection, addBlockAndProceed, addBlockToBody, skipSection, enterFocusMode, editingBlock
    } = useEditor();
    
    // --- NEW: Logic to find the currently selected block for the current section ---
    const currentBlockInstance = pageStructure[currentSection];
    
    const currentBlockData = useMemo(() => {
        // 1. Get the block instance for the current section (Header, Hero, etc.)
        const instance = pageStructure[currentSection];

        if (!instance || instance === 'excluded' || !masterRegistry) return null;

        // 2. Find the block's definition using its ID
        const blockDef = allBlocks.find(b => b.id === instance.blockId);
        if (!blockDef) return null;

        // 3. Determine the content to use:
        //    a. If a block is currently being edited AND its ID matches the current section's block: use tempContent.
        const isCurrentlyEditing = editingBlock && 
                                   editingBlock.blockDef.category.toLowerCase() === currentSection.toLowerCase() &&
                                   editingBlock.instanceId === instance.instanceId;
        
        const content = isCurrentlyEditing ? editingBlock.tempContent : instance.data;

        // 4. Return combined data
        return { blockDef, content, instanceId: instance.instanceId };

    }, [currentSection, pageStructure, allBlocks, masterRegistry, editingBlock]);

    const isMultiInstanceSection = useMemo(() => currentSection === 'body', [currentSection]);

    const visibleBlocks = useMemo(() => {
        if (!allBlocks) return [];
        const normalize = (str) => String(str || '').toLowerCase().replace(/\s+/g, '');
        const sectionAliases = { header: ["header", "headers"], aboutus: ["aboutus", "about-us", "about-us-short"], services: ["services", "service"] }; const normalizedCurrentSection = normalize(currentSection);
        return allBlocks.filter(block => (sectionAliases[normalizedCurrentSection] ? sectionAliases[normalizedCurrentSection].includes(normalize(block.category)) : normalize(block.category) === normalizedCurrentSection) && block.is_visible);
    }, [allBlocks, currentSection]);

    if (isInitialLoading) return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    if (isInFocusMode) return <FocusCustomizer />;
    
    const handleAddToCart = isMultiInstanceSection ? addBlockToBody : addBlockAndProceed;

    return (
        <div className="h-full">
            <SectionNavbar />
            <FilterBar onSkip={skipSection} />
            
            {/* --- FIX: Display the Active Block for the current section (Header) with temporary content --- */}
            {currentBlockData && (
                <div className="mb-8 p-4 bg-white rounded-xl shadow-2xl border-4 border-indigo-400/80">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Current Block: {currentBlockData.blockDef.name} (Live Edit)</h3>
                    <div className="relative border border-gray-300">
                        <BlockRenderer 
                            blockDef={currentBlockData.blockDef} 
                            content={currentBlockData.content} // Pass the tempContent here
                        />
                    </div>
                </div>
            )}
            {/* --- END FIX --- */}


            <div className="space-y-8">
                {visibleBlocks.length > 0 ? (
                    visibleBlocks.map((blockDef) => (
                        <BlockPreviewCard
                            key={blockDef.id}
                            blockDef={blockDef}
                            onSelect={selectBlockForSection}
                            onAddToCart={handleAddToCart}
                            onCustomize={enterFocusMode}
                        />
                    ))
                ) : (
                    <div className="text-center py-16 px-6 bg-gray-50 rounded-lg border-2 border-dashed">
                        <h3 className="text-lg font-medium text-gray-900">No Blocks Available</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            There are no blocks available for the "{currentSection}" section.
                        </p>
                    </div>
                )}
            </div>
            
            <AddBlockSection 
                title={`Add Another ${currentSection.charAt(0).toUpperCase() + currentSection.slice(1)} Block`}
                blocks={visibleBlocks} 
                onAdd={addBlockToBody} 
            />
        </div>
    );
}

export default BlockSelector;
