import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const AdminForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [resetUrl, setResetUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setMessage('');
        setResetUrl('');
        setLoading(true);
        
        try {
            const res = await api.post('/api/auth/forgot-password', { email });
            setMessage(res.data.message);
            setResetUrl(res.data.resetUrl || '');
        } catch (err) {
            setError(
                err.response?.data?.message
                || (err.request ? 'Backend server is not reachable. Start the backend and try again.' : 'Something went wrong. Please try again later.')
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gradient-to-br from-mist via-white to-linen/30 px-4 py-12 dark:from-darkBg dark:via-darkBg dark:to-slate-900">
            <div className="card w-full max-w-md border border-white/70 bg-white/95 shadow-2xl shadow-slate-200/60 backdrop-blur dark:border-slate-800/70 dark:bg-darkCard/95">
                <div className="mb-8 text-center">
                    <img src="/footor-1.svg" alt="Pyaar Foundation logo" className="mx-auto mb-5 h-16 w-16 rounded-2xl object-contain shadow-lg shadow-primary/20" />
                    <h2 className="section-title !text-3xl">Forgot Password</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">Enter your registered admin email to receive a password reset link.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium">Admin Email / Username</label>
                        <input 
                            type="text" 
                            name="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="input-field" 
                            required 
                            placeholder="Enter your registered email or username"
                            disabled={loading}
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                    <div className="text-center">
                        <Link to="/admin-login" className="text-sm font-semibold text-primary transition hover:text-primaryHover hover:underline">
                            Back to Login
                        </Link>
                    </div>
                </form>
                {message && <p className="mt-5 rounded-2xl bg-primary/10 p-4 text-center font-medium text-primary">{message}</p>}
                {resetUrl && (
                    <div className="mt-4 rounded-2xl bg-linen/70 p-4 text-center">
                        <p className="mb-3 text-sm font-medium text-slate-600">Use this reset link to create a new password.</p>
                        <a href={resetUrl} className="btn-primary inline-flex">
                            Open Reset Password
                        </a>
                        <p className="mt-3 break-all text-xs font-medium text-slate-500">{resetUrl}</p>
                    </div>
                )}
                {error && <p className="mt-5 rounded-2xl bg-red-50 p-4 text-center font-medium text-red-500">{error}</p>}
            </div>
        </div>
    );
};

export default AdminForgotPassword;
