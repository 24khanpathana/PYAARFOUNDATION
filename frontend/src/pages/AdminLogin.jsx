import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ adminId: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async e => {
        e.preventDefault(); setError('');
        try {
            const res = await api.post('/api/auth/login', {
                adminId: formData.adminId.trim(),
                password: formData.password.trim(),
            });
            login(res.data.token); navigate('/admin/dashboard');
        } catch (err) { setError(err.response?.data?.message || 'Login failed'); }
    };

    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gradient-to-br from-mist via-white to-linen/30 p-4 dark:from-darkBg dark:via-darkBg dark:to-slate-900">
            <div className="card w-full max-w-md border border-white/70 bg-white/95 shadow-2xl shadow-slate-200/60 backdrop-blur dark:border-slate-800/70 dark:bg-darkCard/95">
                <div className="mb-8 text-center">
                    <img src="/footor-1.svg" alt="Pyaar Foundation logo" className="mx-auto mb-5 h-16 w-16 rounded-2xl object-contain shadow-lg shadow-primary/20" />
                    <h2 className="section-title !text-3xl">Admin Login</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">Use your registered admin email and password to continue.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium">Admin Email / Username</label>
                        <input type="text" required className="input-field" value={formData.adminId} onChange={e => setFormData({...formData, adminId: e.target.value})} placeholder="Enter your registered email or username" />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">Password</label>
                        <input type="password" required className="input-field" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Enter your password" />
                    </div>
                    <button type="submit" className="btn-primary w-full">Login</button>
                    <div className="mt-4 text-center">
                        <Link to="/admin/forgot-password" className="text-sm text-primary hover:underline">Forgot Password?</Link>
                    </div>
                </form>
                {error && <p className="text-red-500 text-center mt-4 font-medium">{error}</p>}
            </div>
        </div>
    );
};
export default AdminLogin;
