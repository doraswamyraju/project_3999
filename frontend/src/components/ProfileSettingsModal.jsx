// src/components/ProfileSettingsModal.jsx
import React, { useState } from 'react';
import { useTenant } from '../contexts/TenantContext';
import { X, Building, Phone, Briefcase, Plus, Trash2, CheckCircle, Image, Globe, Sparkles } from 'lucide-react';

export default function ProfileSettingsModal({ isOpen, onClose }) {
    const { tenantData, setTenantData } = useTenant();
    const [activeTab, setActiveTab] = useState('branding');
    const [isSaving, setIsSaving] = useState(false);
    const [statusMsg, setStatusMsg] = useState('');

    // Business & Contact Form State
    const [businessName, setBusinessName] = useState(tenantData?.business?.name || '');
    const [tagline, setTagline] = useState(tenantData?.business?.tagline || '');
    const [logoUrl, setLogoUrl] = useState(tenantData?.business?.logoUrl || '');
    const [ownerPhoto, setOwnerPhoto] = useState(tenantData?.business?.ownerPhoto || '');
    const [brandColor, setBrandColor] = useState(tenantData?.business?.brandColor || '#4f46e5');
    const [phone, setPhone] = useState(tenantData?.business?.phone || '');
    const [whatsapp, setWhatsapp] = useState(tenantData?.business?.whatsapp || '');
    const [email, setEmail] = useState(tenantData?.business?.email || '');
    const [address, setAddress] = useState(tenantData?.business?.address || '');

    // Catalog state (Services)
    const [services, setServices] = useState(tenantData?.services || []);
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newPrice, setNewPrice] = useState('');

    if (!isOpen) return null;

    const showNotification = (msg) => {
        setStatusMsg(msg);
        setTimeout(() => setStatusMsg(''), 3000);
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setStatusMsg('');

        try {
            const res = await fetch('http://localhost:5000/api/tenant/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: tenantData?.business?.id || 1,
                    business_name: businessName,
                    tagline,
                    brand_color: brandColor,
                    phone_number: phone,
                    whatsapp,
                    email,
                    address,
                    logo_url: logoUrl,
                    owner_photo: ownerPhoto
                })
            });
            const data = await res.json();
            if (data.success) {
                // Update local TenantContext so builder re-hydrates in real time!
                setTenantData(prev => ({
                    ...prev,
                    business: {
                        ...prev.business,
                        name: businessName,
                        tagline,
                        brandColor,
                        phone,
                        whatsapp,
                        email,
                        address,
                        logoUrl,
                        ownerPhoto
                    }
                }));
                showNotification('Profile updated! Website builder re-hydrated.');
            }
        } catch (err) {
            console.error(err);
            showNotification('Error updating profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        try {
            const res = await fetch('http://localhost:5000/api/tenant/service', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: tenantData?.business?.id || 1,
                    title: newTitle,
                    description: newDesc,
                    price: Number(newPrice) || 0,
                    icon: 'Briefcase'
                })
            });
            const data = await res.json();
            if (data.success) {
                const addedItem = { id: data.id, title: newTitle, description: newDesc, price: newPrice, icon: 'Briefcase' };
                const updatedList = [...services, addedItem];
                setServices(updatedList);
                setTenantData(prev => ({ ...prev, services: updatedList }));
                setNewTitle('');
                setNewDesc('');
                setNewPrice('');
                showNotification('Service added to catalog!');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteService = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/tenant/service/${id}`, { method: 'DELETE' });
            const updated = services.filter(s => s.id !== id);
            setServices(updated);
            setTenantData(prev => ({ ...prev, services: updated }));
            showNotification('Service removed');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
                {/* Header */}
                <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-bold text-base">Business Profile & Catalog</h2>
                            <p className="text-xs text-slate-400">All data automatically seeds into your website blocks</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Sub-Tabs */}
                <div className="flex border-b border-slate-200 px-6 bg-slate-50 flex-shrink-0">
                    <button
                        onClick={() => setActiveTab('branding')}
                        className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition ${
                            activeTab === 'branding' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        <Building className="w-4 h-4" />
                        <span>Branding & Identity</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('contact')}
                        className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition ${
                            activeTab === 'contact' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        <Phone className="w-4 h-4" />
                        <span>Contact & Location</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('catalog')}
                        className={`flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition ${
                            activeTab === 'catalog' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        <Briefcase className="w-4 h-4" />
                        <span>Services & Products ({services.length})</span>
                    </button>
                </div>

                {/* Status alert */}
                {statusMsg && (
                    <div className="bg-emerald-600 text-white text-xs font-semibold py-2 px-6 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>{statusMsg}</span>
                    </div>
                )}

                {/* Tab Contents */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-100">
                    {activeTab === 'branding' && (
                        <form onSubmit={handleSaveProfile} className="max-w-2xl mx-auto space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Company / Business Name</label>
                                <input
                                    type="text"
                                    required
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    placeholder="e.g. Apex Tech Solutions"
                                    className="w-full px-3.5 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tagline / Short Bio</label>
                                <input
                                    type="text"
                                    value={tagline}
                                    onChange={(e) => setTagline(e.target.value)}
                                    placeholder="e.g. Transforming businesses with cutting-edge tech"
                                    className="w-full px-3.5 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Logo URL</label>
                                    <input
                                        type="text"
                                        value={logoUrl}
                                        onChange={(e) => setLogoUrl(e.target.value)}
                                        placeholder="http://localhost:5000/logo.png"
                                        className="w-full px-3.5 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Brand Accent Color</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={brandColor}
                                            onChange={(e) => setBrandColor(e.target.value)}
                                            className="w-10 h-10 rounded-lg cursor-pointer border-0"
                                        />
                                        <span className="text-xs font-mono text-slate-600">{brandColor}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Owner / Founder Photo URL</label>
                                <input
                                    type="text"
                                    value={ownerPhoto}
                                    onChange={(e) => setOwnerPhoto(e.target.value)}
                                    placeholder="https://images.unsplash.com/photo-..."
                                    className="w-full px-3.5 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition text-sm shadow-md mt-4"
                            >
                                {isSaving ? 'Saving...' : 'Save Branding Changes'}
                            </button>
                        </form>
                    )}

                    {activeTab === 'contact' && (
                        <form onSubmit={handleSaveProfile} className="max-w-2xl mx-auto space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+91 98765 43210"
                                        className="w-full px-3.5 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">WhatsApp Number</label>
                                    <input
                                        type="text"
                                        value={whatsapp}
                                        onChange={(e) => setWhatsapp(e.target.value)}
                                        placeholder="+919876543210"
                                        className="w-full px-3.5 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="info@mybusiness.com"
                                    className="w-full px-3.5 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Physical Address / City</label>
                                <textarea
                                    rows={3}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Door No, Street Name, City, Pincode"
                                    className="w-full px-3.5 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition text-sm shadow-md mt-4"
                            >
                                {isSaving ? 'Saving...' : 'Save Contact Details'}
                            </button>
                        </form>
                    )}

                    {activeTab === 'catalog' && (
                        <div className="max-w-3xl mx-auto space-y-6">
                            {/* Add service form */}
                            <form onSubmit={handleAddService} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                                <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-1.5">
                                    <Plus className="w-4 h-4 text-indigo-600" />
                                    <span>Add New Service to Catalog</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <input
                                        type="text"
                                        required
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        placeholder="Service Title (e.g. Web Design)"
                                        className="px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    <input
                                        type="text"
                                        value={newDesc}
                                        onChange={(e) => setNewDesc(e.target.value)}
                                        placeholder="Short description"
                                        className="px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={newPrice}
                                            onChange={(e) => setNewPrice(e.target.value)}
                                            placeholder="Price (₹)"
                                            className="w-1/2 px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                        <button
                                            type="submit"
                                            className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition"
                                        >
                                            Add Service
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Existing services catalog */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {services.map((item) => (
                                    <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-800">{item.title}</h4>
                                            <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                                            {item.price > 0 && (
                                                <span className="inline-block mt-2 font-bold text-xs text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                                                    ₹{item.price}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleDeleteService(item.id)}
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
