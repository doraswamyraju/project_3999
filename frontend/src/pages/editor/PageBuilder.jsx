// src/pages/editor/PageBuilder.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import BlockRenderer from '../../components/BlockRenderer.jsx';
import BlockEditModal from '../../components/BlockEditModal.jsx';
import AddBlockForm from '../../components/AddBlockForm.jsx';
import WebsitePreviewModal from '../../components/WebsitePreviewModal.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import Spinner from '../../components/Spinner.jsx';
import { useBranding } from '../../contexts/BrandingContext.jsx';
import { PageIcon, BlockIcon, EditIcon, TrashIcon, MinusCircleIcon, ShoppingCartIcon } from '../../components/Icons.jsx';

/**
 * @file PageBuilder.jsx
 * @brief The main component for building and editing website pages.
 */
function PageBuilder({ selectedPage, allBlocks, showAlert }) {
    const [pageBlocks, setPageBlocks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingBlock, setEditingBlock] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const branding = useBranding();

    // --- LOCAL REFRESH TRIGGER ---
    const [pageRefreshTrigger, setPageRefreshTrigger] = useState(0);
    const forcePageRefresh = () => setPageRefreshTrigger(t => t + 1);

    // --- STATES FOR THE GUIDED BUILD FLOW ---
    const [currentBuildStage, setCurrentBuildStage] = useState('selectHeader');
    const [selectedHeaderBlockData, setSelectedHeaderBlockData] = useState(null);
    const [selectedHeroBlockData, setSelectedHeroBlockData] = useState(null);
    const [selectedAboutUsBlockData, setSelectedAboutUsBlockData] = useState(null);
    const [selectedBlocksByCategory, setSelectedBlocksByCategory] = useState({});
    const [excludedCategories, setExcludedCategories] = useState(new Set());
    const [showFullWebsitePreviewModal, setShowFullWebsitePreviewModal] = useState(false);

    // --- STATES & REFS FOR UI EFFECTS (SCROLL/HOVER) ---
    const [blockScrollTops, setBlockScrollTops] = useState({});
    const [hoveredBlockId, setHoveredBlockId] = useState(null);

    const handleBlockScroll = useCallback((blockId, event) => {
        setBlockScrollTops(prev => ({ ...prev, [blockId]: event.target.scrollTop }));
    }, []);

    useEffect(() => {
        const fetchPageSpecificBlocks = async () => {
            if (!selectedPage || !branding || allBlocks.length === 0) {
                setPageBlocks([]);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/get_site_blocks.php?site_page_id=${selectedPage.id}`);
                if (!response.ok) throw new Error(`Network response was not ok`);
                const data = await response.json();
                if (data.success) {
                    const processedBlocks = data.data.map(block => {
                        const blockDef = allBlocks.find(b => b.id.toString() === block.block_id.toString()) || {};
                        let content = {};
                        try {
                            let parsedContent = JSON.parse(block.content || '{}');
                            if (typeof parsedContent === 'string') parsedContent = JSON.parse(parsedContent);
                            content = parsedContent;
                        } catch (e) {
                            console.error("Failed to parse block content:", block.content, "Error:", e);
                            content = {};
                        }
                        
                        if (typeof content !== 'object' || content === null) {
                            content = {};
                        }

                        // --- THIS IS THE FIX ---
                        // This logic now runs every time blocks are fetched.
                        // It dynamically injects the latest branding data into any existing Header block.
                        if (blockDef.category === 'Header') {
                            content.companyName = branding.business_name || content.companyName;
                            content.logoUrl = branding.logo_url || content.logoUrl;
                            content.phoneNumber = branding.phone_number || content.phoneNumber;
                            content.emailAddress = branding.email || content.emailAddress;
                        }
                        
                        return { ...block, content };
                    });
                    setPageBlocks(processedBlocks);
                } else {
                    setError(data.message || 'Failed to fetch page blocks.');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPageSpecificBlocks();
    }, [selectedPage, branding, allBlocks, pageRefreshTrigger]);

    const handleApiCall = async (endpoint, body, successMessage) => {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!response.ok) throw new Error('Network response error');
            const result = await response.json();
            if (result.success) {
                showAlert(successMessage);
                forcePageRefresh();
            } else {
                throw new Error(result.message || "An unknown error occurred.");
            }
        } catch (err) {
            showAlert(`Error: ${err.message}`);
        }
    };

    const handleAddBlock = (blockId) => {
        if (!selectedPage) {
            showAlert("Please select a page first.");
            return;
        }
        const blockDefinition = allBlocks.find(b => b.id.toString() === blockId.toString());
        let initialContent = { title: "New Block Title", description: "Default content." };

        if (blockDefinition?.category === 'Header') {
            initialContent = {
                logoUrl: branding?.logo_url || "https://placehold.co/150x50/CCCCCC/FFFFFF?text=Logo",
                companyName: branding?.business_name || "Your Business Name",
                services: ["Home", "About", "Contact"],
                phoneNumber: branding?.phone_number || "+91 7997991101", 
                emailAddress: branding?.email || "info@yourcompany.com",
            };
        } else if (blockDefinition?.category === 'Hero') {
             initialContent = {
                heading: "Your Awesome Hero Heading",
                subheading: "A compelling subheading to capture attention.",
                ctaText: "Learn More",
                ctaLink: "#",
                image: "https://placehold.co/1920x1080/E0E0E0/333333?text=Hero+Background",
                secondaryCtaText: "Explore",
                secondaryCtaLink: "#"
            };
        } else if (blockDefinition?.category === 'About Us') {
             initialContent = {
                heading: "About Our Company",
                subheading: "Our Mission and Vision",
                paragraph: "Detailed information about our history, values, and what makes us unique.",
                imageUrl: "https://placehold.co/600x400/E2E8F0/4A5568?text=Our+Team"
            };
        }

        handleApiCall('/save_block.php', {
            site_page_id: selectedPage.id,
            block_id: blockId,
            content: JSON.stringify(initialContent),
            block_order: pageBlocks.length + 1,
        }, "Block added successfully!");
    };

    const handleSaveEditedBlock = (updatedContent) => {
        handleApiCall('/update_block.php', { id: editingBlock.id, content: JSON.stringify(updatedContent) }, "Block updated successfully!");
        setEditingBlock(null);
    };

    const handleDeleteBlock = () => {
        handleApiCall('/delete_block.php', { id: confirmDelete.id }, "Block deleted successfully!");
        setConfirmDelete(null);
    };

    const handleAddToCart = useCallback((blockId, blockCategory) => {
        if (selectedBlocksByCategory[blockCategory]) {
            showAlert(`Only one ${blockCategory} block can be added per page.`);
            return;
        }
        setExcludedCategories(prev => {
            const newSet = new Set(prev);
            newSet.delete(blockCategory);
            return newSet;
        });
        const blockToAdd = pageBlocks.find(block => block.id === blockId);
        if (blockToAdd) {
            setSelectedBlocksByCategory(prev => ({ ...prev, [blockCategory]: blockId }));
            showAlert(`${blockCategory} block added to cart!`);
            if (blockCategory === 'Header') {
                setSelectedHeaderBlockData(blockToAdd);
                setCurrentBuildStage('selectHero');
            } else if (blockCategory === 'Hero') {
                setSelectedHeroBlockData(blockToAdd);
                setCurrentBuildStage('selectAboutUs');
            } else if (blockCategory === 'About Us') {
                setSelectedAboutUsBlockData(blockToAdd);
                setCurrentBuildStage('finalPreview');
            }
        }
    }, [pageBlocks, selectedBlocksByCategory, showAlert]);

    const handleExcludeCategory = (category) => {
        setExcludedCategories(prev => new Set(prev).add(category));
        showAlert(`${category} section excluded.`);
        if (category === 'Header') {
            setSelectedHeaderBlockData(null);
            setCurrentBuildStage('selectHero');
        } else if (category === 'Hero') {
            setSelectedHeroBlockData(null);
            setCurrentBuildStage('selectAboutUs');
        } else if (category === 'About Us') {
            setSelectedAboutUsBlockData(null);
            setCurrentBuildStage('finalPreview');
        }
    };

    const handleStartOver = () => {
        setSelectedHeaderBlockData(null);
        setSelectedHeroBlockData(null);
        setSelectedAboutUsBlockData(null);
        setSelectedBlocksByCategory({});
        setExcludedCategories(new Set());
        setCurrentBuildStage('selectHeader');
        setShowFullWebsitePreviewModal(false);
    };

    const handleConfirmDesign = () => showAlert("Design confirmed! Proceeding to next steps.");

    const HEADER_HEIGHTS = {
        'Header 1': { topBar: 38, mainHeader: 76 },
        'Header 2': { topBar: 38, mainHeader: 80 },
        'Header 3': { topBar: 38, mainHeader: 80 },
        'Header 4': { topBar: 38, mainHeader: 88 },
        'Header 5': { topBar: 42, mainHeader: 80 },
        'Header 6': { topBar: 40, mainHeader: 80 },
        'Header 7': { topBar: 40, mainHeader: 80 },
        'Header 8': { topBar: 40, mainHeader: 80 },
        'Header 9': { topBar: 40, mainHeader: 80, ctaBar: 52 },
        'Header 10': { topBar: 40, mainHeader: 80 },
    };
    const BLOCK_CONTAINER_HEIGHT = 384;
    const ANIMATION_SCROLL_THRESHOLD = 50;
    const POST_ANIMATION_BUFFER_HEIGHT = 150;

    const getPaddingTop = (blockName) => {
        const heights = HEADER_HEIGHTS[blockName];
        if (!heights) return 0;
        const totalHeaderFixedComponentHeight = heights.topBar + heights.mainHeader + (heights.ctaBar || 0);
        const remainingSpace = BLOCK_CONTAINER_HEIGHT - totalHeaderFixedComponentHeight;
        return Math.max(0, remainingSpace / 2);
    };

    const getPlaceholderHeight = (blockName) => {
        const heights = HEADER_HEIGHTS[blockName];
        if (!heights) return 250;
        return ANIMATION_SCROLL_THRESHOLD + POST_ANIMATION_BUFFER_HEIGHT;
    };

    if (!selectedPage) {
        return (
            <div className="flex-grow flex items-center justify-center bg-gray-100">
                <div className="text-center text-gray-500">
                    <PageIcon className="w-16 h-16 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold">Select a page from the sidebar</h2>
                </div>
            </div>
        );
    }

    const filteredBlocks = pageBlocks.filter(block => {
        const blockDef = allBlocks.find(b => b.id.toString() === block.block_id.toString());
        if (!blockDef) return false;
        if (currentBuildStage === 'selectHeader') return blockDef.category === 'Header';
        if (currentBuildStage === 'selectHero') return blockDef.category === 'Hero';
        if (currentBuildStage === 'selectAboutUs') return blockDef.category === 'About Us';
        return false;
    });

    return (
        <div className="flex-grow px-4 py-8 bg-gray-100 overflow-y-auto">
            <header className="mb-8 flex justify-between items-start">
                <div>
                    <h2 className="text-4xl font-bold text-gray-800">{selectedPage.name}</h2>
                    <p className="text-gray-500 mt-1">
                        {currentBuildStage === 'selectHeader' && "Step 1: Select a header for your page, or exclude the section."}
                        {currentBuildStage === 'selectHero' && "Step 2: Now, select a hero section, or exclude it."}
                        {currentBuildStage === 'selectAboutUs' && "Step 3: Choose an 'About Us' section, or exclude it."}
                        {currentBuildStage === 'finalPreview' && "Step 4: Your final page preview."}
                    </p>
                </div>
                <div className="flex-shrink-0 ml-4">
                    {currentBuildStage === 'selectHeader' && <button onClick={() => handleExcludeCategory('Header')} className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"><MinusCircleIcon className="w-5 h-5 mr-2" />Exclude Header</button>}
                    {currentBuildStage === 'selectHero' && <button onClick={() => handleExcludeCategory('Hero')} className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"><MinusCircleIcon className="w-5 h-5 mr-2" />Exclude Hero</button>}
                    {currentBuildStage === 'selectAboutUs' && <button onClick={() => handleExcludeCategory('About Us')} className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"><MinusCircleIcon className="w-5 h-5 mr-2" />Exclude About Us</button>}
                </div>
            </header>

            {isLoading && <Spinner />}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">{error}</div>}

            {currentBuildStage !== 'finalPreview' && !isLoading && !error && (
                <div className="space-y-6">
                    {filteredBlocks.length > 0 ? (
                        filteredBlocks.sort((a, b) => a.block_order - b.block_order).map((block) => {
                            const blockDef = allBlocks.find(b => b.id.toString() === block.block_id.toString()) || {};
                            const currentScrollTop = blockScrollTops[block.id] || 0;
                            const paddingTopForBlock = getPaddingTop(blockDef.name);
                            const placeholderHeight = getPlaceholderHeight(blockDef.name);
                            const isAdded = selectedBlocksByCategory[blockDef.category] === block.id;

                            return (
                                <div key={block.id} className={`bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-all duration-200 relative group ${hoveredBlockId === block.id ? 'ring-2 ring-blue-500' : ''}`} onMouseEnter={() => setHoveredBlockId(block.id)} onMouseLeave={() => setHoveredBlockId(null)}>
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800">{blockDef.name || 'Unknown Block'}</h3>
                                            <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">{blockDef.category || 'N/A'}</span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button onClick={() => setEditingBlock({ ...block, name: blockDef.name, category: blockDef.category })} className="text-blue-500 p-2 rounded-full hover:bg-blue-100" title="Edit Block"><EditIcon /></button>
                                            <button onClick={() => setConfirmDelete(block)} className="text-red-500 p-2 rounded-full hover:bg-red-100" title="Delete Block"><TrashIcon /></button>
                                        </div>
                                    </div>
                                    <div id={`scroll-container-${block.id}`} className="h-96 overflow-y-scroll border border-gray-300 rounded-md relative" onScroll={(e) => handleBlockScroll(block.id, e)} style={{ paddingTop: `${paddingTopForBlock}px` }}>
                                        <BlockRenderer blockDef={blockDef} content={block.content} containerScrollTop={currentScrollTop} onAddToCart={() => handleAddToCart(block.id, blockDef.category)} isAddedToCart={isAdded} />
                                        <div className={`bg-gray-50 p-4 z-0`} style={{ height: `${placeholderHeight}px` }}>
                                            <p className="text-gray-400">Scrollable content area for {blockDef.name}...</p>
                                            <p className="text-gray-400">Current Scroll Top: {currentScrollTop.toFixed(0)}px</p>
                                        </div>
                                    </div>
                                    <div className={`absolute bottom-4 right-4 transition-opacity duration-300 ${hoveredBlockId === block.id ? 'opacity-100' : 'opacity-0'}`}>
                                        <button onClick={() => handleAddToCart(block.id, blockDef.category)} className={`p-3 rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center ${isAdded ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`} title={isAdded ? "Added to Cart" : "Add to Cart"} disabled={isAdded}>
                                            <ShoppingCartIcon className="w-6 h-6" />
                                            {!isAdded && <span className="ml-2 hidden sm:inline">Add</span>}
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12 px-6 bg-white rounded-lg shadow-md border-dashed border-2 border-gray-300">
                            <BlockIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700">No {currentBuildStage.replace('select', '')} blocks available.</h3>
                            <p className="text-gray-500 mt-2">Add a block of this category to continue.</p>
                        </div>
                    )}
                </div>
            )}

            {currentBuildStage === 'finalPreview' && (
                <div className="space-y-6 border p-6 rounded-lg shadow-md bg-white">
                    <h3 className="text-2xl font-bold text-gray-800">Your Custom Page Preview</h3>
                    <div className="border border-gray-300 rounded-md overflow-hidden divide-y divide-gray-200">
                        {selectedHeaderBlockData ? <BlockRenderer blockDef={allBlocks.find(b => b.id.toString() === selectedHeaderBlockData.block_id.toString())} content={selectedHeaderBlockData.content} /> : <div className="p-4 text-center text-gray-500 bg-gray-50">{excludedCategories.has('Header') ? 'Header Section Excluded' : 'No Header Selected'}</div>}
                        {selectedHeroBlockData ? <BlockRenderer blockDef={allBlocks.find(b => b.id.toString() === selectedHeroBlockData.block_id.toString())} content={selectedHeroBlockData.content} /> : <div className="p-4 text-center text-gray-500 bg-gray-50">{excludedCategories.has('Hero') ? 'Hero Section Excluded' : 'No Hero Selected'}</div>}
                        {selectedAboutUsBlockData ? <BlockRenderer blockDef={allBlocks.find(b => b.id.toString() === selectedAboutUsBlockData.block_id.toString())} content={selectedAboutUsBlockData.content} /> : <div className="p-4 text-center text-gray-500 bg-gray-50">{excludedCategories.has('About Us') ? 'About Us Section Excluded' : 'No About Us Section Selected'}</div>}
                        <div className="p-8 text-center text-gray-400 bg-gray-50"><p>Additional content blocks would be displayed below.</p></div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                        <button onClick={handleStartOver} className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700">Start Over</button>
                        <button onClick={() => setShowFullWebsitePreviewModal(true)} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">View Full Website</button>
                        <button onClick={handleConfirmDesign} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">Confirm Design</button>
                    </div>
                </div>
            )}

            {currentBuildStage !== 'finalPreview' && (
                <AddBlockForm allBlocks={allBlocks.filter(block => {
                    if (currentBuildStage === 'selectHeader') return block.category === 'Header';
                    if (currentBuildStage === 'selectHero') return block.category === 'Hero';
                    if (currentBuildStage === 'selectAboutUs') return block.category === 'About Us';
                    return false;
                })} onAddBlock={handleAddBlock} />
            )}

            {editingBlock && <BlockEditModal block={editingBlock} onSave={handleSaveEditedBlock} onClose={() => setEditingBlock(null)} />}
            {confirmDelete && <ConfirmDialog message="Are you sure you want to delete this block?" onConfirm={handleDeleteBlock} onCancel={() => setConfirmDelete(null)} />}
            {showFullWebsitePreviewModal && (
                <WebsitePreviewModal
                    headerBlock={selectedHeaderBlockData}
                    heroBlock={selectedHeroBlockData}
                    aboutUsBlock={selectedAboutUsBlockData}
                    onClose={() => setShowFullWebsitePreviewModal(false)}
                    allBlocks={allBlocks}
                />
            )}
        </div>
    );
}

export default PageBuilder;
