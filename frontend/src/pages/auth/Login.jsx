// src/pages/auth/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, Mail, ShieldCheck, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost/project_3999/api/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (data.success && data.user) {
                login(data.user);
            } else {
                setError(data.message || 'Login failed. Please check credentials.');
            }
        } catch (err) {
            setError('Server connection error. Make sure Apache/MySQL is running.');
        } finally {
            setIsLoading(false);
        }
    };

    const fillCredentials = (demoEmail, demoPass) => {
        setEmail(demoEmail);
        setPassword(demoPass);
        setError('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 mb-4">
                        <span className="text-2xl font-black tracking-wider">3999</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Website Builder</h2>
                    <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
                </div>

                {error && (
                    <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@3999.com"
                                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 text-sm outline-none transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 text-sm outline-none transition"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                    >
                        {isLoading ? (
                            <span>Signing In...</span>
                        ) : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                {/* Quick 1-Click Login Helper for Admin & User */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-xs text-center font-medium text-gray-500 mb-3 uppercase tracking-wider">
                        Quick Demo Logins
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => fillCredentials('admin@3999.com', 'admin123')}
                            className="flex items-center justify-center gap-1.5 py-2 px-3 border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/80 text-indigo-700 text-xs font-semibold rounded-lg transition"
                        >
                            <ShieldCheck className="w-4 h-4 text-indigo-600" />
                            <span>Admin</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => fillCredentials('user@3999.com', 'user123')}
                            className="flex items-center justify-center gap-1.5 py-2 px-3 border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-700 text-xs font-semibold rounded-lg transition"
                        >
                            <UserCheck className="w-4 h-4 text-emerald-600" />
                            <span>User</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

