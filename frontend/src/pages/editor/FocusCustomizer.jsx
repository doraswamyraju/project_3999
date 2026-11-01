// File: /src/components/Editor/FocusCustomizer.jsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useEditor } from '../../contexts/EditorContext.jsx';
import BlockRenderer from '../../components/BlockRenderer.jsx';

// --- Icon Components (Unchanged) ---
const Icon = ({ path, className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);
const CloseIcon = (props) => <Icon path="M6 18L18 6M6 6l12 12" {...props} />;
const PreviewIcon = (props) => <Icon path="M2.036 12.322a1.012 1.012 0 010-.639l4.43-7.087a1.012 1.012 0 011.586 0l4.43 7.087c.23.368.23.882 0 1.25l-4.43 7.087a1.012 1.012 0 01-1.586 0l-4.43-7.087zM12 9a3 3 0 100 6 3 3 0 000-6z" {...props} />;
const PlusIcon = (props) => <Icon path="M12 4.5v15m7.5-7.5h-15" {...props} />;
const MinusIcon = (props) => <Icon path="M18 12H6" {...props} />;
const UploadIcon = (props) => <Icon path="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" {...props} />;
const DraggableIcon = (props) => <Icon path="M3.75 9h16.5m-16.5 6.75h16.5" className="w-6 h-6 text-gray-400 cursor-grab" {...props} />;

// --- UI Components (Unchanged) ---
const ToggleSwitch = ({ enabled, setEnabled }) => (
    <button
      type="button"
      onClick={() => setEnabled(!enabled)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${enabled ? 'bg-cyan-500' : 'bg-gray-600'}`}
    >
      <span aria-hidden="true" className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
);

const TextField = ({ label, name, value, onChange, placeholder, type = 'text' }) => (
    <div className="mb-5">
        <label htmlFor={name} className="block text-sm font-medium text-gray-200 mb-1">{label}</label>
        {type === 'textarea'
            ? <textarea 
                id={name} name={name} value={value} onChange={onChange} rows={3} placeholder={placeholder} 
                className="mt-1 block w-full bg-gray-800/60 text-gray-100 border border-gray-700/80 rounded-lg shadow-inner focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition duration-300 backdrop-blur-sm" 
              />
            : <input 
                type={type} id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} 
                className="mt-1 block w-full bg-gray-800/60 text-gray-100 border border-gray-700/80 rounded-lg shadow-inner focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition duration-300 backdrop-blur-sm" 
              />
        }
    </div>
);

const ImageField = ({ label, name, value, dimensions, onChange }) => {
    const fileInputRef = useRef(null); 

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange({ target: { name, value: reader.result } });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-100">{label}</label>
                <ToggleSwitch enabled={true} setEnabled={() => {}} />
            </div>
            <div className="flex items-center space-x-3">
                <img 
                    src={value || 'https://placehold.co/80x80/2f3e4e/d1d5db?text=No+Image'} 
                    alt={label} 
                    className="w-20 h-20 object-contain bg-gray-800 border-2 border-cyan-500/50 rounded-lg p-1 shadow-xl" 
                />
                
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*"
                    className="hidden" 
                />

                <button 
                    type="button" 
                    onClick={handleButtonClick}
                    className="flex-1 h-20 bg-gray-700/50 border-2 border-dashed border-cyan-500/50 rounded-lg hover:bg-gray-600/50 flex flex-col items-center justify-center transition-colors text-white text-sm font-medium shadow-lg" 
                >
                    <UploadIcon className="text-cyan-400 w-6 h-6 mb-1" />
                    Upload Image
                </button>
            </div>
            {dimensions && <p className="text-xs text-gray-400 mt-2">{dimensions}</p>}
        </div>
    );
};

const Accordion = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl mb-6 shadow-2xl transition-all duration-300 border border-gray-700 hover:border-cyan-500/50">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex justify-between items-center p-4 rounded-t-xl transition-colors bg-gray-900/40 hover:bg-gray-900/60"
            >
                <div className="flex items-center">
                    <DraggableIcon className="text-gray-500 hover:text-cyan-400" />
                    <h3 className="text-xl font-extrabold text-white ml-3">{title}</h3>
                </div>
                <div className="flex items-center space-x-3">
                    <ToggleSwitch enabled={isOpen} setEnabled={setIsOpen} />
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600 text-cyan-400 shadow-inner">
                        {isOpen ? <MinusIcon /> : <PlusIcon />}
                    </div>
                </div>
            </button>
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
                <div className="p-6 border-t border-gray-700">
                    {children}
                </div>
            </div>
        </div>
    );
};


// --- Field Config (Updated to include Services variants) ---
const fieldConfig = {
  Header: [
    { name: 'companyName', label: 'Company Name', type: 'text', section: 'Text' },
    { name: 'phoneNumber', label: 'Phone Number', type: 'text', section: 'Text' },
    { name: 'emailAddress', label: 'Email Address', type: 'text', section: 'Text' },
    { name: 'services', label: 'Nav Links (comma-separated)', type: 'textarea', section: 'Text' },
    { name: 'logoUrl', label: 'Brand Logo', type: 'image', section: 'Images', dimensions: '(160x80px, 3:1)' },
  ],
  Hero: [
    { name: 'heading', label: 'Heading', type: 'text', section: 'Text' },
    { name: 'subheading', label: 'Subheading', type: 'textarea', section: 'Text' },
    { name: 'ctaText', label: 'Button Text', type: 'text', section: 'Text' },
    { name: 'image', label: 'Background Image', type: 'image', section: 'Images', dimensions: '(1920x1080px)' },
  ],
  // --- DYNAMIC AboutUs Configuration (Categorized by usage) ---
  AboutUs: [
    // 1. Core Text (Used by 90% of blocks)
    { name: 'mainHeading', label: 'Main Title', type: 'text', section: 'Text', variants: ['About Us 1', 'About Us 2', 'About Us 3', 'About Us 4', 'About Us 5'] },
    
    // 2. CTA Fields (V1 excludes CTA)
    { name: 'ctaText', label: 'CTA Button Text', type: 'text', section: 'Text', variants: ['About Us 2', 'About Us 3', 'About Us 4', 'About Us 5'] },
    { name: 'ctaLink', label: 'CTA Button Link', type: 'text', section: 'Text', variants: ['About Us 2', 'About Us 3', 'About Us 4', 'About Us 5'] }, 
    
    // 3. V1 (Counters) Specific Fields
    { name: 'subheading', label: 'Subheading/Motto', type: 'textarea', section: 'Text', variants: ['About Us 1'] },
    { name: 'servicesList', label: 'Service Capsules (comma-separated)', type: 'textarea', section: 'Text', variants: ['About Us 1'] },
    { name: 'leadsTarget', label: 'Leads Target (Number)', type: 'text', section: 'Numbers', variants: ['About Us 1'] },
    { name: 'trafficTarget', label: 'Traffic Target (Number)', type: 'text', section: 'Numbers', variants: ['About Us 1'] },
    { name: 'rankingsTarget', label: 'Rankings Target (Number)', type: 'text', section: 'Numbers', variants: ['About Us 1'] },
    
    // 4. V2, V3, V4 Narrative/Description Fields
    { name: 'approachHeading', label: 'Approach Heading', type: 'text', section: 'Text', variants: ['About Us 2', 'About Us 3'] },
    { name: 'visionHeading', label: 'Vision Heading', type: 'text', section: 'Text', variants: ['About Us 4'] },
    { name: 'description', label: 'Short Description/Paragraph', type: 'textarea', section: 'Text', variants: ['About Us 2', 'About Us 3', 'About Us 4'] },
    
    // 5. V5 (Story) Specific Fields
    { name: 'storyHeading', label: 'Story Heading', type: 'text', section: 'Text', variants: ['About Us 5'] },
    { name: 'paragraph1', label: 'Paragraph 1', type: 'textarea', section: 'Text', variants: ['About Us 5'] },
    { name: 'paragraph2', label: 'Paragraph 2', type: 'textarea', section: 'Text', variants: ['About Us 5'] },
    
    // 6. Images
    { name: 'imageUrl', label: 'Main Image/Photo (V1)', type: 'image', section: 'Images', dimensions: '(600x400px)', variants: ['About Us 1'] },
    { name: 'backgroundImage', label: 'Background Image (V2, V3, V4)', type: 'image', section: 'Images', dimensions: '(1920x1080px)', variants: ['About Us 2', 'About Us 3', 'About Us 4'] },
    
    // 7. Advanced Raw Fields (All variants that use features/cards)
    { name: 'featuresRaw', label: 'Features/Value Cards (Raw JSON Array)', type: 'textarea', section: 'Advanced', variants: ['About Us 2', 'About Us 3', 'About Us 4', 'About Us 5'] },
  ],
  // --- Services Configuration ---
  Services: [
    // Core Text (Used by all variants)
    { name: 'serviceMotto', label: 'Motto/Category', type: 'text', section: 'Text', variants: ['Services 1', 'Services 2', 'Services 3'] },
    { name: 'mainTitle', label: 'Main Title', type: 'text', section: 'Text', variants: ['Services 1', 'Services 2', 'Services 3'] },
    { name: 'description', label: 'Introductory Paragraph', type: 'textarea', section: 'Text', variants: ['Services 1', 'Services 2', 'Services 3'] },

    // V1 & V2: Simple Array of Service Cards
    { name: 'servicesRaw', label: 'Service Cards (Raw JSON Array)', type: 'textarea', section: 'Advanced', variants: ['Services 1', 'Services 2'] },
    
    // V3: Tabbed Service Structure (Raw JSON Object)
    { name: 'tabbedServicesRaw', label: 'Tabbed Services (Raw JSON Object)', type: 'textarea', section: 'Advanced', variants: ['Services 3'] },
  ],
};

// --- Main Component ---
const FocusCustomizer = () => {
    const { editingBlock, updateTempContent, saveCustomizationAndProceed, exitFocusMode } = useEditor();
    const [localContent, setLocalContent] = useState({});
    const [previewScrollTop, setPreviewScrollTop] = useState(0);

    // Escape Key Listener
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                exitFocusMode();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [exitFocusMode]);

    const handlePreviewScroll = useCallback((event) => {
        setPreviewScrollTop(event.currentTarget.scrollTop);
    }, []);

    useEffect(() => {
        if (editingBlock) {
            // Start with a deep copy of the content object (which is now clean from EditorContext)
            const tempContent = JSON.parse(JSON.stringify(editingBlock.tempContent));
            
            // Define all complex keys that need to be converted to Raw JSON for editing
            const complexKeys = [
                { sourceKey: 'features', rawKey: 'featuresRaw' },     // About Us 2, 3, 4
                { sourceKey: 'valueCards', rawKey: 'featuresRaw' },   // About Us 5
                { sourceKey: 'services', rawKey: 'servicesRaw' },     // Services 1, 2
                { sourceKey: 'servicesData', rawKey: 'tabbedServicesRaw' }, // Services 3
            ];
            
            // Clear all raw fields first
            tempContent.featuresRaw = ''; 
            tempContent.servicesRaw = '';
            tempContent.tabbedServicesRaw = '';
            
            // Check for and stringify the complex array/object for editing in the Advanced tab
            for (const { sourceKey, rawKey } of complexKeys) {
                 if (tempContent[sourceKey] && (Array.isArray(tempContent[sourceKey]) || typeof tempContent[sourceKey] === 'object')) {
                     tempContent[rawKey] = JSON.stringify(tempContent[sourceKey], null, 2);
                 }
            }

            setLocalContent(tempContent);
        }
    }, [editingBlock]);

    if (!editingBlock) return null;

    const { blockDef } = editingBlock;
    const currentBlockName = blockDef.name;
    const fields = fieldConfig[blockDef.category] || fieldConfig[blockDef.category.replace(/\s/g, '')] || [];

    // --- Dynamic Field Filtering Function ---
    const filterFields = (field) => {
        const category = blockDef.category.toLowerCase().replace(/\s/g, '');
        
        // If the category is NOT AboutUs or Services, show all fields
        if (category !== 'aboutus' && category !== 'services') return true; 

        // If category IS AboutUs or Services, check if the current block name is listed in the field's variants
        return field.variants && field.variants.includes(currentBlockName);
    };
    // ----------------------------------------

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        let newContent = { ...localContent };
        
        // 1. Handle comma-separated lists (e.g., Nav Links, Service Capsules)
        const isListArray = name === 'services' || name === 'servicesList';
        if (isListArray) {
            const processedValue = value.split(',').map(s => s.trim()).filter(Boolean);
            newContent[name] = processedValue;
        } 
        // 2. Handle raw JSON array for About Us Features/ValueCards
        else if (name === 'featuresRaw') {
            newContent[name] = value;
            try {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) {
                    // Decide whether to save as 'valueCards' (About Us 5) or 'features' (V2, V3, V4)
                    const saveKey = currentBlockName.includes('About Us 5') ? 'valueCards' : 'features';
                    newContent[saveKey] = parsed;
                }
            } catch (error) {
                // Ignore parsing errors, save raw text for display
            }
        }
        // 3. Handle raw JSON for Services (V1 and V2)
        else if (name === 'servicesRaw') {
            newContent[name] = value;
            try {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) {
                    newContent.services = parsed; // Save parsed data to the 'services' key
                }
            } catch (error) {
                // Ignore parsing errors
            }
        }
        // 4. Handle raw JSON for Tabbed Services (V3)
        else if (name === 'tabbedServicesRaw') {
            newContent[name] = value;
            try {
                const parsed = JSON.parse(value);
                if (typeof parsed === 'object' && !Array.isArray(parsed)) {
                    newContent.servicesData = parsed; // Save parsed data to the 'servicesData' key
                }
            } catch (error) {
                // Ignore parsing errors
            }
        }
        // 5. Handle all other simple fields
        else {
            newContent[name] = value;
        }
        
        setLocalContent(newContent);
        updateTempContent(newContent); 
    };
    
    const renderField = (field) => {
        const isListArray = field.name === 'services' || field.name === 'servicesList';
        const isRawJson = field.name.endsWith('Raw');
        
        let value;

        if (isRawJson) {
             value = localContent[field.name] || '';
        } else if (isListArray && Array.isArray(localContent[field.name])) {
            // Display the array content as a comma-separated string for editing
            value = localContent[field.name].join(', '); 
        } else {
            // Standard field
            value = localContent[field.name] || ''; 
        }
        
        const commonProps = {
            id: field.name, name: field.name, value, 
            onChange: handleInputChange, // Use the single handler
            placeholder: `Enter ${field.label}...`,
        };
        
        switch(field.type) {
            case 'image':
                return <ImageField key={field.name} label={field.label} name={field.name} value={value} onChange={handleInputChange} dimensions={field.dimensions} />;
            case 'textarea':
                return <TextField key={field.name} label={field.label} type='textarea' {...commonProps} />;
            default:
                return <TextField key={field.name} label={field.label} type='text' {...commonProps} />;
        }
    };
    
    const renderSection = (title, section, defaultOpen = false, rawJsonWarning = false) => {
        // Filter the fields based on the current block name AND the section
        const fieldsToRender = fields.filter(filterFields).filter(f => f.section === section);
        
        // ONLY render the Accordion if there are fields to show
        if (fieldsToRender.length === 0) return null;

        return (
            <Accordion title={title} defaultOpen={defaultOpen}>
                {rawJsonWarning && (
                    // FINAL, ROBUST FIX: Using a JSX expression with a template literal to contain the string.
                    <p className='text-sm text-gray-400 mb-4'>{`Use **valid JSON format** to edit items. For lists, use a JSON **Array** ([{"key": "value"}]). For grouped services, use a JSON **Object** ({"group": [...]}). Be careful not to break the syntax!`}</p>
                )}
                <div className={`grid grid-cols-1 ${section !== 'Advanced' ? 'md:grid-cols-2 gap-x-6' : ''}`}>
                    {fieldsToRender.map(renderField)}
                </div>
            </Accordion>
        );
    };


    return (
        <div className="h-full flex flex-col bg-gray-900 text-white">
            
            <div className="flex-shrink-0 sticky top-0 z-20 py-4 bg-gray-900/90 backdrop-blur-lg border-b border-cyan-500/30 px-6 shadow-xl">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-extrabold text-white">
                        <span className="text-cyan-400 mr-2">Customizing:</span> {currentBlockName}
                    </h3>
                    <button onClick={exitFocusMode} className="flex items-center px-4 py-2 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 shadow-md transition-all">
                        <CloseIcon className="w-5 h-5 mr-2" /> Close Editor
                    </button>
                </div>
            </div>
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <div 
                    className="h-96 flex-shrink-0 bg-gray-800/80 backdrop-blur-sm shadow-inner overflow-y-auto border-b border-gray-700"
                    onScroll={handlePreviewScroll}
                >
                    <div className="p-4 bg-gray-900/50 sticky top-0 z-10 text-sm font-semibold text-cyan-400 border-b border-gray-700">
                        Live Preview (Block: {currentBlockName})
                    </div>
                    <BlockRenderer 
                        blockDef={blockDef} 
                        content={localContent}
                        containerScrollTop={previewScrollTop}
                    />
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                    
                    {/* Render Text Fields: Only fields in the 'Text' section AND current block's variants will appear */}
                    {renderSection("Headings & Paragraphs", "Text", true)}
                    
                    {/* Render Number Fields: Only appears for V1 (About Us) */}
                    {renderSection("Numerical Targets", "Numbers")}

                    {/* Render Image Fields: Only the appropriate image field for V1 or V2/V3/V4 (About Us) will appear */}
                    {renderSection("Imagery & Media", "Images")}
                    
                    {/* Advanced Raw Fields: Services and About Us features */}
                    {renderSection("Advanced: Service Cards (Raw JSON)", "Advanced", false, true)}

                    <Accordion title="Style & Colors">
                        <p className="text-gray-400 p-4">Advanced color and style options coming soon. 🎨</p>
                    </Accordion>
                </div>
            </div>
            
            <div className="flex-shrink-0 sticky bottom-0 z-20 py-4 bg-gray-900/90 backdrop-blur-lg border-t border-cyan-500/30 px-6 shadow-xl">
                <div className="flex justify-end items-center space-x-3">
                    <button onClick={() => updateTempContent(localContent)} className="flex items-center px-4 py-2 border border-cyan-500/50 rounded-lg text-sm font-semibold text-cyan-400 bg-gray-800 hover:bg-gray-700 transition-all shadow-lg">
                        <PreviewIcon className="w-5 h-5 mr-2" /> Quick Update
                    </button>
                    <button onClick={saveCustomizationAndProceed} className="flex items-center px-6 py-2 border border-transparent rounded-lg text-sm font-extrabold text-white bg-green-600 hover:bg-green-700 shadow-xl transition-all">
                        🚀 Finalize & Proceed
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FocusCustomizer;