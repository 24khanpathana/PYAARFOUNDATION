import Adoption from './pages/Adoption';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Team from './pages/Team';
import Events from './pages/Events';
import Service from './pages/Service';
import Contact from './pages/Contact';
import Sponsors from './pages/Sponsors';

import Gallery from './pages/Gallery';
import Donation from './pages/Donation';
import DonationSchema from './pages/DonationSchema';
import AdminLogin from './pages/AdminLogin';
import AdminForgotPassword from './pages/AdminForgotPassword';
import AdminResetPassword from './pages/AdminResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';

import { AuthProvider } from './context/AuthContext';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

function App() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <AuthProvider>
            <Router>
                <ScrollToTop />
                <Navbar theme={theme} setTheme={setTheme} />
                <div className="min-h-screen pt-24">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/team" element={<Team />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/service" element={<Service />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/adoption" element={<Adoption />} />
                        <Route path="/adoption-animals" element={<Adoption />} />
                        <Route path="/donation-schema" element={<DonationSchema />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/sponsors" element={<Sponsors />} />
                        <Route path="/donate" element={<Donation />} />
                        <Route path="/admin" element={<AdminLogin />} />
                        <Route path="/admin-login" element={<AdminLogin />} />
                        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
                        <Route path="/admin/reset-password" element={<AdminResetPassword />} />
                        <Route path="/admin/dashboard" element={
                            <ProtectedRoute>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </div>
                <Footer />
                <Link to="/donate" className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-honey to-primary px-5 py-4 text-sm font-black text-white shadow-2xl shadow-honey/30 transition hover:from-clay hover:to-primary">
                    Donate Now
                </Link>
            </Router>
        </AuthProvider>
    );
}

export default App;
