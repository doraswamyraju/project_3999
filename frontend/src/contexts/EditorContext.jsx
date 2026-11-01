// File: /src/contexts/EditorContext.jsx

import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import Spinner from '../components/Spinner.jsx'; // Reverted import path
import { v4 as uuidv4 } from 'uuid';
import { getServicesRegistry } from '../registries/servicesRegistry.jsx'; // Reverted import path
import { getHeadersRegistry } from '../registries/headerRegistry.jsx'; // Reverted import path
import { getHeroRegistry } from '../registries/heroRegistry.jsx'; // Reverted import path
import { getAboutUsRegistry } from '../registries/aboutUsRegistry.jsx'; // Reverted import path

const EditorContext = createContext(null);

export const useEditor = () => {
    const context = useContext(EditorContext);
    if (!context) throw new Error('useEditor must be used within an EditorProvider');
    return context;
};

export const SECTION_ORDER = ['header', 'hero', 'aboutUs', 'services', 'testimonials', 'footer'];
export const ALL_SECTIONS = [...SECTION_ORDER, 'body'];

const getInitialPageStructure = () => ({
    header: null,
    hero: null,
    aboutUs: null,
    services: null,
    testimonials: null,
    footer: null,
    body: [],
});

export const EditorProvider = ({ children, showAlert: externalShowAlert }) => {
    const showAlert = useCallback((msg, type) => {
        if (typeof externalShowAlert === "function") {
            externalShowAlert(msg, type);
        } else {
            console.log(`[Alert - ${type || "info"}]:`, msg);
        }
    }, [externalShowAlert]);
    const [allBlocks, setAllBlocks] = useState([]);
    const [branding, setBranding] = useState(null);
    const [pages, setPages] = useState([]);
    const [apiError, setApiError] = useState(null);
    const [isInitialLoading, setInitialLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(null);
    const [currentPageId, setCurrentPageId] = useState(null);
    const [pageStructure, setPageStructure] = useState(getInitialPageStructure());
    const [currentSection, setCurrentSection] = useState(SECTION_ORDER[0]);
    const [editingBlock, setEditingBlock] = useState(null);
    const [isInFocusMode, setIsInFocusMode] = useState(false); const [isFinalModalOpen, setIsFinalModalOpen] = useState(false);
    
    const [masterRegistryState, setMasterRegistryState] = useState(null);

    const handleSetCurrentPage = useCallback((page) => {
        if (page) {
            setCurrentPage(page.name);
            setCurrentPageId(page.id);
        }
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            setInitialLoading(true);
            setApiError(null);
            try {
                const [
                  pagesRes, blocksRes, brandingRes,
                  loadedHeadersRegistry, loadedHeroRegistry, loadedAboutUsRegistry, loadedServicesRegistry
                ] = await Promise.all([
                    fetch('http://localhost/project_3999/api/get_pages.php'),
                    fetch('http://localhost/project_3999/api/get_blocks.php'),
                    fetch('http://localhost/project_3999/api/get_user_data.php'),
                    getHeadersRegistry(),
                    getHeroRegistry(),
                    getAboutUsRegistry(),
                    getServicesRegistry()
                ]);

                if (!pagesRes.ok || !blocksRes.ok || !brandingRes.ok) {
                    const errorDetails = `Pages: ${pagesRes.statusText}, Blocks: ${blocksRes.statusText}, Branding: ${brandingRes.statusText}`;
                    throw new Error(`One or more network responses were not ok. Details: ${errorDetails}`);
                }

                const pagesResult = await pagesRes.json();
                const blocksResult = await blocksRes.json();
                const brandingResult = await brandingRes.json();

                if (pagesResult.success) {
                    setPages(pagesResult.data);
                    if (pagesResult.data.length > 0) {
                        handleSetCurrentPage(pagesResult.data[0]);
                    }
                } else {
                    throw new Error(pagesResult.message || 'Failed to fetch pages');
                }
                
                if (blocksResult.success) {
                    setAllBlocks(blocksResult.data);
                } else {
                    throw new Error(blocksResult.message || 'Failed to fetch blocks');
                }
                
                if (brandingResult.success) {
                    setBranding(brandingResult.data);
                } else {
                    throw new Error(brandingResult.message || 'Failed to fetch branding data');
                }

                const tempMasterRegistry = {
                    ...loadedHeadersRegistry,
                    ...loadedHeroRegistry,
                    ...loadedAboutUsRegistry,
                    ...loadedServicesRegistry,
                };
                setMasterRegistryState(tempMasterRegistry);

            } catch (err) {
                console.error("Error fetching initial data:", err);
                setApiError(err.message);
            } finally {
                setInitialLoading(false);
            }
        };
        fetchInitialData();
    }, [handleSetCurrentPage]);
    
    useEffect(() => {
        if (currentPageId) {
            setPageStructure(getInitialPageStructure());
            setCurrentSection(SECTION_ORDER[0]);
        }
    }, [currentPageId]);

    // --- Service Defaults ---
    // Note: Icon strings are used here, which the Services components must map to the actual SVG components.
    const defaultServiceCards = [
        { title: 'SEO Optimization', description: 'Climb search rankings and drive organic traffic.', icon: 'Search' },
        { title: 'PPC Campaigns', description: 'Maximize your ROI with targeted pay-per-click campaigns.', icon: 'Megaphone' },
        { title: 'Social Media', description: 'Engage your audience and build a strong brand presence.', icon: 'Users' },
        { title: 'Content Marketing', description: 'Create valuable content that attracts, informs, and converts.', icon: 'BarChart' },
        { title: 'Email Marketing', description: 'Nurture leads and build customer loyalty with personalized campaigns.', icon: 'Mail' },
        { title: 'Web Development', description: 'We build beautiful, high-performance websites for a great user experience.', icon: 'Code' },
    ];

    const defaultServiceCardsWithImage = [
        { title: 'SEO Optimization', description: 'Our comprehensive SEO strategies are designed to elevate your website’s ranking on search engines.', image: 'https://placehold.co/600x400/7c3aed/ffffff?text=SEO', icon: 'Search' },
        { title: 'PPC Campaigns', description: 'Achieve immediate visibility and targeted traffic with our data-driven Pay-Per-Click campaigns.', image: 'https://placehold.co/600x400/db2777/ffffff?text=PPC', icon: 'Megaphone' },
        { title: 'Social Media Marketing', description: 'Build a vibrant online community and a powerful brand presence. We create and execute tailored social media strategies.', image: 'https://placehold.co/600x400/1d4ed8/ffffff?text=Social', icon: 'Users' },
        { title: 'Content Marketing', description: 'From insightful blog posts and articles to compelling videos, we produce high-quality content that attracts.', image: 'https://placehold.co/600x400/16a34a/ffffff?text=Content', icon: 'BarChart' },
        { title: 'Email Marketing', description: 'Nurture leads and foster customer loyalty through strategic email marketing.', image: 'https://placehold.co/600x400/ea580c/ffffff?text=Email', icon: 'Mail' },
        { title: 'Web Development', description: 'We design and develop beautiful, responsive, and high-performance websites that convert visitors.', image: 'https://placehold.co/600x400/57534e/ffffff?text=Web+Dev', icon: 'Code' },
    ];
    
    const defaultTabbedServices = {
        growth: [
            { icon: 'Search', title: 'SEO Optimization', description: 'Climb the search rankings and drive organic traffic.' },
            { icon: 'Megaphone', title: 'PPC Campaigns', description: 'Targeted ads that convert and maximize your ROI.' },
            { icon: 'Users', title: 'Social Media', description: 'Build a strong brand presence and engage your audience.' },
        ],
        creative: [
            { icon: 'BarChart', title: 'Content Marketing', description: 'Valuable content that attracts, informs, and converts.' },
            { icon: 'Mail', title: 'Email Marketing', description: 'Nurture leads and build loyalty with personalized campaigns.' },
        ],
        technical: [
            { icon: 'Code', title: 'Web Development', description: 'High-performance websites for a great user experience.' },
        ],
    };

    // --- UPDATED: getInitialContent function to use switch for all variants ---
    const getInitialContent = useCallback((blockDef) => {
        const category = blockDef.category.toLowerCase().replace(/\s+/g, '');
        const variant = blockDef.name;
        const b = branding || { logo_url: "https://placehold.co/150x50/4F46E5/FFFFFF?text=Logo", business_name: "Innovate Inc.", phone_number: "+1 (555) 123-4567", email: "contact@innovate.com" };
        
        // About Us Defaults
        const defaultFeatures = [
            { title: 'Designs that Convert', description: 'User-centric designs focused on turning visitors into customers.' },
            { title: 'Strategies that Scale', description: 'Data-driven marketing plans that grow with your business.' },
            { title: 'Partnerships that Last', description: 'We succeed when you do, building relationships on trust and results.' },
        ];
        
        const defaultValueCards = [
             { title: "Transparency First", icon: "Shield", children: "Open communication is our foundation. You're always in the loop." },
             { title: "Authentic Creativity", icon: "Bulb", children: "We craft unique solutions that reflect your brand's true identity." },
             { title: "Shared Success", icon: "Growth", children: "We measure our success by the growth and achievements of our clients." },
             { title: "Lasting Relationships", icon: "Handshake", children: "We're not just a one-time vendor; we're your long-term digital partner." },
        ];
        
        const defaultDescription = "At Rajugari Ventures, we don't just build websites; we engineer digital solutions. Our team thrives on data and creativity, designing marketing strategies and web experiences that are not only visually stunning but are precision-tuned to drive conversions, engagement, and growth.";


        switch(category) {
            case 'header': 
                return { logoUrl: b.logo_url, companyName: b.business_name, phoneNumber: b.phone_number, emailAddress: b.email, services: ["Home", "About", "Services", "Contact"] };
            
            case 'hero': 
                return { heading: "Build Your Future With Us", subheading: "We provide the best solutions for your business.", ctaText: "Get Started", image: "https://placehold.co/1920x1080/E0E0E0/333333?text=Hero+Image" };
            
            case 'aboutus': 
                switch(variant) {
                    case 'About Us 1':
                        return {
                            mainHeading: "Let the numbers talk about us",
                            subheading: "Tangible results, visible growth. We focus on measurable outcomes — not empty promises.",
                            leadsTarget: "5000",
                            trafficTarget: "150000",
                            rankingsTarget: "95",
                            servicesList: ["Digital Marketing", "Social Media", "SEO", "Web Dev"],
                            imageUrl: "https://placehold.co/600x400/E2E8F0/4A5568?text=Our+Team",
                        };
                    case 'About Us 2':
                    case 'About Us 3':
                        return {
                            mainHeading: "Digital Architects of Tangible Results",
                            approachHeading: "Our Approach",
                            description: defaultDescription,
                            ctaText: "See the Proof",
                            ctaLink: "#",
                            backgroundImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
                            features: defaultFeatures,
                            featuresRaw: JSON.stringify(defaultFeatures, null, 2),
                        };
                    case 'About Us 4':
                        return {
                            mainHeading: "Engineering Tomorrow's Digital Frontier",
                            visionHeading: "Our Vision",
                            description: "At Rajugari Ventures, we don't just adapt to the future; we build it. We are pioneers of innovation, leveraging next-gen tech to create digital experiences that are not just current, but ahead of the curve.",
                            ctaText: "Step into the Future",
                            ctaLink: "#",
                            features: defaultFeatures,
                            featuresRaw: JSON.stringify(defaultFeatures, null, 2),
                        };
                    case 'About Us 5':
                        return {
                            mainHeading: "More Than a Service, We're Your Partner",
                            storyHeading: "Our Story",
                            paragraph1: "At Rajugari Ventures, we believe the best digital experiences are born from collaboration and authentic connection. We're a team of passionate creators dedicated to understanding your story and translating it into a compelling digital presence.",
                            paragraph2: "Your goals become our goals. We're here to listen, to understand your audience, and to build a lasting partnership founded on transparency, trust, and shared success.",
                            ctaText: "Let's Tell Your Story",
                            ctaLink: "#",
                            valueCards: defaultValueCards,
                            featuresRaw: JSON.stringify(defaultValueCards, null, 2),
                        };
                    default: 
                        return { mainHeading: "Default About Us Content" };
                }
            
            case 'services': 
                switch(variant) {
                    case 'Services 1':
                        return { 
                            serviceMotto: "Our Services", 
                            mainTitle: "Everything You Need to Grow Online", 
                            description: "We offer a complete suite of digital marketing services to help your business succeed.", 
                            services: defaultServiceCards, // Array of {title, description, icon}
                        };
                    case 'Services 2':
                        return {
                            serviceMotto: "Our Services",
                            mainTitle: "A Partnership for Growth",
                            description: "We provide a full spectrum of digital marketing services. Select a service to learn more.",
                            services: defaultServiceCardsWithImage, // Array of {title, description, icon, image}
                        };
                    case 'Services 3':
                        return {
                            serviceMotto: "Our Expertise",
                            mainTitle: "Solutions Tailored for You",
                            description: "We group our services into logical categories to better address your specific business needs.",
                            servicesData: defaultTabbedServices, // Object of arrays {group: [...]}
                        };
                    default:
                        return { serviceMotto: "Our Services", mainTitle: "Default Services Content", description: "Default description." };
                }

            default: 
                return { title: `New ${blockDef.name}`, description: "This is default content." };
        }
    }, [branding, defaultServiceCards, defaultServiceCardsWithImage, defaultTabbedServices]);
    // --- END UPDATED: getInitialContent function ---

    const advanceToNextSection = useCallback(() => {
        const currentIndex = SECTION_ORDER.indexOf(currentSection);
        if (currentIndex < SECTION_ORDER.length - 1) {
            setCurrentSection(SECTION_ORDER[currentIndex + 1]);
        } else {
            showAlert("You've completed all main sections!", 'success');
        }
    }, [currentSection, showAlert]);
    
    const addBlockAndProceed = useCallback((blockDef) => {
        const newBlockInstance = { instanceId: uuidv4(), blockId: blockDef.id, variant: blockDef.name, data: getInitialContent(blockDef) };
        setPageStructure(prev => ({ ...prev, [currentSection]: newBlockInstance }));
        showAlert(`'${blockDef.name}' added to '${currentSection}'.`, 'success');
        advanceToNextSection();
    }, [currentSection, getInitialContent, advanceToNextSection, showAlert]);

    const addBlockToBody = useCallback((blockDef) => {
        const newBlockInstance = { instanceId: uuidv4(), blockId: blockDef.id, variant: blockDef.name, data: getInitialContent(blockDef) };
        setPageStructure(prev => ({ ...prev, body: [...prev.body, newBlockInstance] }));
        showAlert(`'${blockDef.name}' added to page body.`);
    }, [getInitialContent, showAlert]);

    const selectBlockForSection = useCallback((blockDef) => {
        const newBlockInstance = { instanceId: uuidv4(), blockId: blockDef.id, variant: blockDef.name, data: getInitialContent(blockDef) };
        const category = blockDef.category.toLowerCase().replace(/\s/g, '');
        if (category === 'body') {
            addBlockToBody(blockDef);
        } else {
            setPageStructure(prev => ({ ...prev, [currentSection]: newBlockInstance }));
            showAlert(`Previewing '${blockDef.name}' for '${currentSection}'.`);
        }
    }, [currentSection, getInitialContent, showAlert, addBlockToBody]);

    const skipSection = useCallback(() => {
        setPageStructure(prev => ({ ...prev, [currentSection]: 'excluded' }));
        showAlert(`Skipped the ${currentSection} section.`);
        advanceToNextSection();
    }, [currentSection, advanceToNextSection, showAlert]);

    const finalizePage = () => { setIsFinalModalOpen(true); }; const closeFinalModal = () => { setIsFinalModalOpen(false); };

    const enterFocusMode = useCallback((blockDef) => {
        // When entering focus mode, use a deep copy of the initial content/data
        const initialContent = getInitialContent(blockDef);
        setEditingBlock({ blockDef, tempContent: initialContent, instanceId: uuidv4() });
        setIsInFocusMode(true);
    }, [getInitialContent]);

    const exitFocusMode = () => {
        setEditingBlock(null);
        setIsInFocusMode(false);
    };
    
    const updateTempContent = useCallback((newContent) => {
        if (editingBlock) setEditingBlock(prev => ({ ...prev, tempContent: newContent }));
    }, [editingBlock]);

    const saveCustomizationAndProceed = useCallback(() => {
        if (!editingBlock) return;
        const { blockDef, tempContent, instanceId } = editingBlock;
        
        // Clean up all temporary raw keys before saving the final data
        const finalData = { ...tempContent };
        delete finalData.featuresRaw;
        delete finalData.servicesRaw;
        delete finalData.tabbedServicesRaw;
        
        const newBlockInstance = { instanceId, blockId: blockDef.id, variant: blockDef.name, data: finalData };
        const category = blockDef.category.toLowerCase().replace(/\s/g, '');

        if (category === 'body') {
            addBlockToBody(blockDef);
        } else {
            setPageStructure(prev => ({ ...prev, [currentSection]: newBlockInstance }));
            advanceToNextSection();
        }
        showAlert(`${blockDef.name} customized and added.`);
        exitFocusMode();
    }, [editingBlock, currentSection, advanceToNextSection, showAlert, addBlockToBody]);

    const value = useMemo(() => ({
        allBlocks, branding, isInitialLoading, apiError, masterRegistry: masterRegistryState,
        pages, currentPage, handleSetCurrentPage, 
        pageStructure,
        currentSection, setCurrentSection, 
        isInFocusMode, editingBlock,
        selectBlockForSection, skipSection, finalizePage, isFinalModalOpen, closeFinalModal,
        enterFocusMode, exitFocusMode, updateTempContent, saveCustomizationAndProceed,
        addBlockAndProceed, addBlockToBody
    }), [
        allBlocks, branding, isInitialLoading, apiError, masterRegistryState,
        pages, currentPage, handleSetCurrentPage, 
        pageStructure,
        currentSection, isInFocusMode, editingBlock,
        selectBlockForSection, skipSection, finalizePage, isFinalModalOpen, closeFinalModal, enterFocusMode, updateTempContent, saveCustomizationAndProceed,
        addBlockAndProceed, addBlockToBody, setCurrentSection
    ]);

    if (isInitialLoading || !masterRegistryState) {
      if (apiError) return <div className="h-screen w-screen flex items-center justify-center text-red-600 p-4 bg-red-50 rounded-lg shadow-md"><strong>Error:</strong><p className="mt-2">{apiError}</p></div>;
      return <div className="h-screen w-screen flex items-center justify-center bg-gray-100"><Spinner /></div>;
    }
    
    return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};

