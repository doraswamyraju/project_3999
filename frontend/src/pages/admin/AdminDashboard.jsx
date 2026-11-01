// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PlusCircle, Eye, EyeOff, Trash2, LogOut, Code, Layout, CheckCircle, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const [blocks, setBlocks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMsg, setStatusMsg] = useState('');

    // New block form state
    const [name, setName] = useState('');
    const [category, setCategory] = useState('headers');
    const [previewImg, setPreviewImg] = useState('');
    const [blockCode, setBlockCode] = useState('');
    const [previewMode, setPreviewMode] = useState(false);

    const categories = [
        { label: 'Headers', value: 'headers' },
        { label: 'Hero', value: 'hero' },
        { label: 'About Us', value: 'about-us-short' },
        { label: 'Services', value: 'services' },
        { label: 'Testimonials', value: 'testimonials' },
        { label: 'Footer', value: 'footer' }
    ];

    const fetchBlocks = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost/project_3999/api/get_blocks.php');
            const data = await res.json();
            if (data.success) {
                setBlocks(data.data);
            }
        } catch (err) {
            console.error('Error fetching blocks:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBlocks();
    }, []);

    const showStatus = (msg) => {
        setStatusMsg(msg);
        setTimeout(() => setStatusMsg(''), 3000);
    };

    const toggleVisibility = async (block) => {
        const newVis = block.is_visible ? 0 : 1;
        try {
            const res = await fetch('http://localhost/project_3999/api/set_block_visibility.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blockId: block.id, isVisible: newVis })
            });
            const data = await res.json();
            if (data.success) {
                showStatus(`Block "${block.name}" visibility updated.`);
                fetchBlocks();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateBlock = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            const res = await fetch('http://localhost/project_3999/api/save_block.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    category,
                    default_preview_img: previewImg || `/previews/${category}1.png`,
                    is_visible: 1,
                    code: blockCode
                })
            });
            const data = await res.json();
            if (data.success) {
                showStatus(`New block "${name}" created successfully!`);
                setName('');
                setBlockCode('');
                setPreviewImg('');
                fetchBlocks();
            } else {
                showStatus(data.message || 'Failed to save block.');
            }
        } catch (err) {
            console.error(err);
            showStatus('Error saving block.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Top Navigation */}
            <header className="bg-slate-900 text-white px-8 py-4 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black">
                        3999
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Admin Console</h1>
                        <p className="text-xs text-slate-400">Block Manager & Template Code Editor</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full font-semibold">
                        Logged in as: {user?.email} (Admin)
                    </span>
                    <button
                        onClick={logout}
                        className="flex items-center gap-1.5 bg-red-600/80 hover:bg-red-600 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Logout</span>
                    </button>
                </div>
            </header>

            {/* Notification Bar */}
            {statusMsg && (
                <div className="bg-emerald-600 text-white text-xs font-semibold py-2 px-8 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>{statusMsg}</span>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 p-8 grid grid-cols-12 gap-8 max-w-7xl mx-auto w-full">
                {/* Left Form: Create New Block */}
                <div className="col-span-12 lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                        <PlusCircle className="w-5 h-5 text-indigo-600" />
                        <h2 className="font-bold text-slate-800 text-base">Create & Publish New Block</h2>
                    </div>

                    <form onSubmit={handleCreateBlock} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                                Block Name
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Header 11, Testimonials 1"
                                className="w-full px-3.5 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                                Section / Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-3.5 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                            >
                                {categories.map(c => (
                                    <option key={c.value} value={c.value}>{c.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                                Preview Image Path (Optional)
                            </label>
                            <input
                                type="text"
                                value={previewImg}
                                onChange={(e) => setPreviewImg(e.target.value)}
                                placeholder="/previews/header1.png"
                                className="w-full px-3.5 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-xs font-semibold text-slate-700 uppercase">
                                    HTML / JSX Code Definition
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setPreviewMode(!previewMode)}
                                    className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                                >
                                    <Code className="w-3.5 h-3.5" />
                                    <span>{previewMode ? 'Edit Code' : 'Preview Live'}</span>
                                </button>
                            </div>

                            {previewMode ? (
                                <div className="p-4 border rounded-xl bg-slate-50 min-h-[160px] flex items-center justify-center text-sm text-slate-600">
                                    <div dangerouslySetInnerHTML={{ __html: blockCode || '<p class="text-slate-400">Empty code preview</p>' }} />
                                </div>
                            ) : (
                                <textarea
                                    rows={6}
                                    value={blockCode}
                                    onChange={(e) => setBlockCode(e.target.value)}
                                    placeholder="<div className='p-8 bg-blue-600 text-white'>\n  <h2>Block Headline</h2>\n</div>"
                                    className="w-full p-3 font-mono text-xs border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition text-sm shadow-md"
                        >
                            Publish Block to Users
                        </button>
                    </form>
                </div>

                {/* Right Table: Existing Blocks Management */}
                <div className="col-span-12 lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <Layout className="w-5 h-5 text-indigo-600" />
                            <h2 className="font-bold text-slate-800 text-base">Live Blocks Catalog ({blocks.length})</h2>
                        </div>
                        <button
                            onClick={fetchBlocks}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition"
                            title="Refresh"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="overflow-y-auto max-h-[560px] divide-y divide-slate-100">
                        {isLoading ? (
                            <p className="text-center py-12 text-sm text-slate-400">Loading catalog...</p>
                        ) : blocks.length === 0 ? (
                            <p className="text-center py-12 text-sm text-slate-400">No blocks found.</p>
                        ) : (
                            blocks.map(block => (
                                <div key={block.id} className="py-3 px-2 flex items-center justify-between hover:bg-slate-50 rounded-lg transition">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 font-bold text-xs flex items-center justify-center">
                                            #{block.id}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-800">{block.name}</h4>
                                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide bg-slate-100 px-2 py-0.5 rounded">
                                                {block.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleVisibility(block)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                                block.is_visible
                                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                            }`}
                                        >
                                            {block.is_visible ? (
                                                <>
                                                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                                    <span>Live</span>
                                                </>
                                            ) : (
                                                <>
                                                    <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>Hidden</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
