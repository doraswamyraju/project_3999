import React, { useState, useMemo } from 'react';
// --- FIX: Importing SECTION_ORDER to ensure correct sequence ---
import { useEditor, SECTION_ORDER } from '../../contexts/EditorContext.jsx';
import BlockRenderer from '../../components/BlockRenderer.jsx';

const BlockIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 19.5v-8.25M12 4.875A2.625 2.625 0 1012 10.125A2.625 2.625 0 0012 4.875z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.125V19.5m-3.75-9.375h7.5" />
    </svg>
);

const Placeholder = ({ sectionName }) => (
    <div className="w-full h-48 flex items-center justify-center bg-gray-100 border-y border-dashed border-gray-300">
        <div className="text-center text-gray-400">
            <BlockIcon className="w-10 h-10 mx-auto mb-2" />
            <p className="font-semibold capitalize">{sectionName.replace(/([A-Z])/g, ' $1').trim()} Section</p>
            <p className="text-sm">Select a block to place it here</p>
        </div>
    </div>
);

const PreviewContent = React.memo(({ previewMode }) => {
    const { allBlocks, pageStructure } = useEditor();
    const [scrollTop, setScrollTop] = useState(0);

    const handleScroll = (event) => setScrollTop(event.currentTarget.scrollTop);

    // --- FIX: Logic now iterates over the master SECTION_ORDER ---
    const renderedSections = useMemo(() => {
        if (!pageStructure || !allBlocks) return [];

        return SECTION_ORDER.map(sectionKey => {
            const sectionContent = pageStructure[sectionKey];

            if (sectionContent === 'excluded') {
                return null; // Don't render anything if the section is excluded
            }

            if (sectionContent === null) {
                // Render placeholder if no block is selected for this section
                return <Placeholder key={sectionKey} sectionName={sectionKey} />;
            }
            
            // Render the actual block
            const blockDef = allBlocks.find(b => b.name === sectionContent.variant);
            if (!blockDef) {
                 return <div key={sectionKey} className="p-2 m-1 text-xs text-red-500 bg-red-50 rounded">Block Error</div>;
            }

            // The header gets special sticky treatment
            const isStickyHeader = sectionKey === 'header';

            return (
                <div key={sectionContent.instanceId} className={`relative group ${isStickyHeader ? 'sticky top-0 z-20' : ''}`}>
                    <BlockRenderer 
                        blockDef={blockDef} 
                        content={sectionContent.data} 
                        containerScrollTop={scrollTop} 
                        previewMode={previewMode} 
                    />
                </div>
            );
        }).filter(Boolean); // Filter out null values for excluded sections

    }, [pageStructure, allBlocks, previewMode, scrollTop]);

    return (
        <div className="w-full h-full overflow-y-auto bg-white" onScroll={handleScroll}>
            {renderedSections}
            <div className="h-[500px] bg-gray-50 flex items-center justify-center">
                <p className="text-gray-400">End of Page Preview</p>
            </div>
        </div>
    );
});

// The rest of the LivePreviewPane component remains unchanged...

const MobilePreview = () => (
    <div className="w-full max-w-[260px] mx-auto">
        <div className="relative mx-auto border-gray-400 bg-gray-300 border-[8px] rounded-[1.5rem] h-[520px] w-full shadow-2xl">
            <div className="h-[24px] w-[2px] bg-gray-300 absolute -left-[10px] top-[60px] rounded-l-lg"></div>
            <div className="h-[24px] w-[2px] bg-gray-300 absolute -left-[10px] top-[100px] rounded-l-lg"></div>
            <div className="h-[40px] w-[2px] bg-gray-300 absolute -right-[10px] top-[120px] rounded-r-lg"></div>
            <div className="rounded-[1.2rem] overflow-hidden w-full h-full bg-white">
                <PreviewContent previewMode="mobile" />
            </div>
        </div>
    </div>
);

const DesktopViewLink = ({ onClick }) => (
    <div className="text-center">
        <button onClick={onClick} className="group flex flex-col items-center text-gray-400 hover:text-indigo-400 transition-colors" aria-label="Open Desktop Preview" >
            <div className="relative w-48 h-28 border-8 border-gray-400 group-hover:border-indigo-400 rounded-t-lg bg-gray-100 transition-colors flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-sm flex items-center justify-center p-2">
                    <span className="text-xs font-semibold text-center text-gray-500 group-hover:text-indigo-500"> Desktop view<br/>click here </span>
                </div>
            </div>
            <div className="w-56 h-4 bg-gray-300 group-hover:bg-indigo-300 rounded-b-md transition-colors"></div>
        </button>
    </div>
);

const DesktopPreviewModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="relative w-full max-w-6xl h-[85vh]" onClick={(e) => e.stopPropagation()} style={{ filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.5))' }} >
            <div className="relative mx-auto border-gray-400 bg-gray-300 border-[16px] rounded-t-2xl h-[95%] w-full">
                <div className="rounded-lg overflow-hidden h-full bg-white">
                    <PreviewContent previewMode="desktop" />
                </div>
                <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 h-4 w-4 bg-gray-500 rounded-full border-2 border-gray-400"></div>
            </div>
            <div className="relative mx-auto bg-gray-200 rounded-b-xl h-[5%] w-[110%] -translate-x-[5%]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-2 rounded-lg bg-gray-400"></div>
            </div>
            <button onClick={onClose} className="absolute -top-5 -right-5 text-white bg-red-500 hover:bg-red-700 rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl border-2 border-white shadow-lg" aria-label="Close" > &times; </button>
        </div>
    </div>
);

function LivePreviewPane() {
  const [isDesktopPreviewOpen, setDesktopPreviewOpen] = useState(false);

  return (
    <>
      <div className="h-full w-full bg-slate-900 p-4 flex flex-col justify-start items-center overflow-y-auto pt-8 border-l-2 border-slate-700">
          <div className="mx-auto w-full flex flex-col items-center space-y-10">
              <div className="w-full flex-shrink-0">
                  <h2 className="text-sm font-semibold text-gray-300 mb-2 text-center">Mobile Preview</h2>
                  <MobilePreview />
              </div>
              <div className="w-full flex justify-center flex-shrink-0">
                  <DesktopViewLink onClick={() => setDesktopPreviewOpen(true)} />
              </div>
          </div>
      </div>
      
      {isDesktopPreviewOpen && (
        <DesktopPreviewModal onClose={() => setDesktopPreviewOpen(false)} />
      )}
    </>
  );
}

export default LivePreviewPane;