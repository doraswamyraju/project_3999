// src/components/FinalWebsiteModal.jsx
import React, { useState } from 'react';
import { useEditor, SECTION_ORDER } from '../contexts/EditorContext.jsx';
import BlockRenderer from './BlockRenderer.jsx';
import { Laptop, Smartphone, X, CheckCircle, Sparkles } from 'lucide-react';

export default function FinalWebsiteModal({ isOpen, onClose }) {
    const { pageStructure, allBlocks } = useEditor();
    const [deviceType, setDeviceType] = useState('desktop');

    if (!isOpen) return null;

    // Use master SECTION_ORDER
    const sectionsToRender = SECTION_ORDER || ['header', 'hero', 'aboutUs', 'services', 'testimonials', 'footer'];

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6">
            <div className="bg-white w-full max-w-7xl h-[95vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
                {/* Header Bar */}
                <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="font-bold text-base">Final Website Preview</h2>
                            <p className="text-xs text-slate-400">All selected blocks assembled together</p>
                        </div>
                    </div>

                    {/* View Switchers */}
                    <div className="flex items-center gap-3">
                        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                            <button
                                onClick={() => setDeviceType('desktop')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                    deviceType === 'desktop' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <Laptop className="w-4 h-4" />
                                <span>Desktop</span>
                            </button>
                            <button
                                onClick={() => setDeviceType('mobile')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                    deviceType === 'mobile' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <Smartphone className="w-4 h-4" />
                                <span>Mobile</span>
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Website Canvas Area */}
                <div className="flex-1 bg-slate-100 overflow-y-auto flex justify-center items-start p-4">
                    {deviceType === 'desktop' ? (
                        <div className="bg-white shadow-xl w-full min-h-full">
                            {sectionsToRender.map((secKey) => {
                                const blockInstance = pageStructure[secKey];
                                if (!blockInstance || blockInstance === 'excluded') return null;

                                const blockDef = allBlocks.find(b => b.name === blockInstance.variant || b.id === blockInstance.blockId);
                                if (!blockDef) return null;

                                return (
                                    <section key={secKey} id={`final-section-${secKey}`}>
                                        <BlockRenderer
                                            blockDef={blockDef}
                                            content={blockInstance.data}
                                            previewMode="desktop"
                                            isPreview={true}
                                        />
                                    </section>
                                );
                            })}

                            {/* Render body blocks if any */}
                            {Array.isArray(pageStructure.body) && pageStructure.body.map((item, idx) => {
                                const blockDef = allBlocks.find(b => b.name === item.variant || b.id === item.blockId);
                                if (!blockDef) return null;
                                return (
                                    <section key={`body-${idx}`}>
                                        <BlockRenderer
                                            blockDef={blockDef}
                                            content={item.data}
                                            previewMode="desktop"
                                            isPreview={true}
                                        />
                                    </section>
                                );
                            })}
                        </div>
                    ) : (
                        /* Mobile Mockup Device Frame */
                        <div className="my-2 flex justify-center">
                            <div className="relative border-slate-800 bg-slate-900 border-[12px] rounded-[3rem] w-[375px] h-[720px] shadow-2xl flex flex-col overflow-hidden">
                                {/* Speaker notch */}
                                <div className="h-6 bg-slate-900 flex justify-center items-center flex-shrink-0 z-20">
                                    <div className="w-20 h-3 bg-slate-800 rounded-full" />
                                </div>
                                {/* Mobile screen inner viewport */}
                                <div className="flex-1 overflow-y-auto bg-white">
                                    {sectionsToRender.map((secKey) => {
                                        const blockInstance = pageStructure[secKey];
                                        if (!blockInstance || blockInstance === 'excluded') return null;

                                        const blockDef = allBlocks.find(b => b.name === blockInstance.variant || b.id === blockInstance.blockId);
                                        if (!blockDef) return null;

                                        return (
                                            <section key={secKey} id={`final-mobile-section-${secKey}`}>
                                                <BlockRenderer
                                                    blockDef={blockDef}
                                                    content={blockInstance.data}
                                                    previewMode="mobile"
                                                    isPreview={true}
                                                />
                                            </section>
                                        );
                                    })}

                                    {Array.isArray(pageStructure.body) && pageStructure.body.map((item, idx) => {
                                        const blockDef = allBlocks.find(b => b.name === item.variant || b.id === item.blockId);
                                        if (!blockDef) return null;
                                        return (
                                            <section key={`mobile-body-${idx}`}>
                                                <BlockRenderer
                                                    blockDef={blockDef}
                                                    content={item.data}
                                                    previewMode="mobile"
                                                    isPreview={true}
                                                />
                                            </section>
                                        );
                                    })}
                                </div>
                                {/* Bottom navigation indicator */}
                                <div className="h-4 bg-slate-900 flex justify-center items-center flex-shrink-0 z-20">
                                    <div className="w-24 h-1 bg-slate-700 rounded-full" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Action Bar */}
                <div className="bg-white border-t border-slate-200 px-6 py-3.5 flex items-center justify-between flex-shrink-0">
                    <span className="text-xs text-slate-500">
                        Ready to deploy your new website design?
                    </span>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
                        >
                            Back to Editor
                        </button>
                        <button
                            onClick={() => alert('Website successfully published!')}
                            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                        >
                            <CheckCircle className="w-4 h-4" />
                            <span>Publish Website</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
