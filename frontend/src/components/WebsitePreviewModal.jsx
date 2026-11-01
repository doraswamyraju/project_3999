// src/components/WebsitePreviewModal.jsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import BlockRenderer from './BlockRenderer.jsx';
import { XMarkIcon, ComputerDesktopIcon, DevicePhoneMobileIcon } from './Icons.jsx';

/**
 * @file WebsitePreviewModal.jsx
 * @brief A modal component for displaying a full, responsive live preview of the assembled website.
 */
const WebsitePreviewModal = ({ headerBlock, heroBlock, aboutUsBlock, onClose, allBlocks }) => {
    const [deviceType, setDeviceType] = useState('desktop');
    const previewContainerRef = useRef(null);
    const [previewScrollTop, setPreviewScrollTop] = useState(0);

    const handlePreviewScroll = useCallback(() => {
        if (previewContainerRef.current) {
            setPreviewScrollTop(previewContainerRef.current.scrollTop);
        }
    }, []);

    useEffect(() => {
        const currentRef = previewContainerRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', handlePreviewScroll);
        }
        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', handlePreviewScroll);              
            }
        };
    }, [handlePreviewScroll]);

    const previewWidthClass = deviceType === 'desktop' ? 'w-full' : 'w-[375px]';
    const previewHeightClass = 'h-full';

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl flex flex-col h-full max-h-[95vh] w-full max-w-6xl">
                <div className="flex-shrink-0 bg-gray-800 text-white p-3 flex items-center justify-between rounded-t-lg">
                    <h3 className="text-lg font-semibold">Live Preview</h3>
                    <div className="flex items-center space-x-3">
                        <button onClick={() => setDeviceType('desktop')} className={`p-2 rounded-md ${deviceType === 'desktop' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`} title="Desktop View">
                            <ComputerDesktopIcon className="w-6 h-6" />
                        </button>
                        <button onClick={() => setDeviceType('mobile')} className={`p-2 rounded-md ${deviceType === 'mobile' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`} title="Mobile View">
                            <DevicePhoneMobileIcon className="w-6 h-6" />
                        </button>
                        <button onClick={onClose} className="p-2 rounded-md bg-red-600 hover:bg-red-700" title="Close Preview">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="flex-grow flex items-center justify-center bg-gray-100 p-4 overflow-hidden">
                    <div ref={previewContainerRef} className={`bg-white border border-gray-300 shadow-lg overflow-y-auto transition-all duration-300 ease-in-out ${previewWidthClass} ${previewHeightClass}`} style={{ borderRadius: deviceType === 'mobile' ? '1.5rem' : '0.5rem' }}>
                        {headerBlock && (
                            <BlockRenderer
                                blockDef={allBlocks.find(b => b.id.toString() === headerBlock.block_id.toString())}
                                content={headerBlock.content}
                                containerScrollTop={previewScrollTop}
                            />
                        )}
                        {heroBlock && (
                            <BlockRenderer
                                blockDef={allBlocks.find(b => b.id.toString() === heroBlock.block_id.toString())}
                                content={heroBlock.content}
                                containerScrollTop={previewScrollTop}
                            />
                        )}
                        {aboutUsBlock && (
                            <BlockRenderer
                                blockDef={allBlocks.find(b => b.id.toString() === aboutUsBlock.block_id.toString())}
                                content={aboutUsBlock.content}
                                containerScrollTop={previewScrollTop}
                            />
                        )}
                        <div className="min-h-[1000px] bg-gray-50 flex items-center justify-center text-gray-400">
                            <p>Additional page content would go here...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebsitePreviewModal;
