import React, { useState, useRef } from 'react';
import { useEditor } from '../../contexts/EditorContext.jsx';
import Sidebar from '../../components/shared/Sidebar.jsx';
import BlockSelector from './BlockSelector.jsx';
import LivePreviewPane from './LivePreviewPane.jsx';
import Spinner from '../../components/Spinner.jsx';
import FinalWebsiteModal from '../../components/FinalWebsiteModal.jsx';

const ChevronUpIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
  </svg>
);

const EditorContent = ({ showAlert }) => {
    const { pageStructure, masterRegistry, isFinalModalOpen, closeFinalModal } = useEditor();
    const [showScrollTop, setShowScrollTop] = useState(false);
    const mainContentRef = useRef(null);

    if (!masterRegistry || pageStructure === null) {
        return <div className="h-full flex-1 flex items-center justify-center bg-gray-100"><Spinner /><span className="ml-4 text-gray-600">Initializing Page...</span></div>;
    }
    
    const handleScroll = () => {
        if (mainContentRef.current) setShowScrollTop(mainContentRef.current.scrollTop > 300);
    };

    const scrollToTop = () => {
        mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="flex-1 grid grid-cols-12 overflow-hidden relative">
            <div ref={mainContentRef} onScroll={handleScroll} className="col-span-12 lg:col-span-8 xl:col-span-9 overflow-y-auto p-8">
                <BlockSelector showAlert={showAlert} />
            </div>
            
            <div className="hidden lg:block col-span-4 xl:col-span-3 bg-gray-200 border-l border-gray-300">
                <LivePreviewPane />
            </div>

            {showScrollTop && (
                <button onClick={scrollToTop} className="absolute bottom-8 right-1/4 lg:right-1/3 xl:right-[27%] z-20 w-12 h-12 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center transition-opacity duration-300" aria-label="Scroll to top">
                    <ChevronUpIcon className="w-6 h-6" />
                </button>
            )}

            {/* Final Assembled Website Modal */}
            <FinalWebsiteModal
                isOpen={isFinalModalOpen}
                onClose={closeFinalModal}
            />
        </div>
    );
};

function EditorLayout({ showAlert }) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
         <EditorContent showAlert={showAlert} />
      </main>
    </div>
  );
}

export default EditorLayout;
