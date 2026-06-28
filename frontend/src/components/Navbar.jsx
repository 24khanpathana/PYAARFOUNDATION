import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = ({ theme, setTheme }) => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    const closeMenu = () => setIsMenuOpen(false);

    const links = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Services', path: '/service' },
        { name: 'Events', path: '/events' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Volunteer', path: '/team' },
        { name: 'Sponsors', path: '/sponsors' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/40 bg-white/76 backdrop-blur-2xl shadow-sm transition-all duration-300 dark:border-slate-800/70 dark:bg-clay/85">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 lg:px-8 xl:px-12">
                <Link to="/" onClick={closeMenu} className="flex min-w-0 flex-1 items-center gap-3 leading-none lg:flex-none lg:shrink-0">
                    <img src="/footor-1.svg" alt="Pyaar Foundation logo" className="h-11 w-11 flex-none rounded-2xl object-contain shadow-lg shadow-primary/20 sm:h-13 sm:w-13" />
                    <div className="min-w-0 overflow-hidden">
                        <p className="truncate text-[0.92rem] font-black uppercase leading-tight tracking-[0.14em] text-primary dark:text-primary sm:text-[1.08rem]">
                            PYAAR FOUNDATION
                        </p>
                        <p className="mt-1 hidden max-w-[15rem] text-[0.58rem] font-bold uppercase leading-tight tracking-[0.22em] text-slate-700 dark:text-slate-200 sm:block sm:max-w-none sm:text-[0.66rem]">
                            ANIMAL REHABILITATORS
                        </p>
                    </div>
                </Link>

                <div className="hidden min-w-0 items-center gap-3 lg:flex xl:gap-6">
                    <ul className="flex min-w-0 items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300 xl:gap-5">
                        {links.map(link => (
                            <li key={link.name}>
                                <Link
                                    to={link.path}
                                    className={`transition ${location.pathname === link.path ? 'text-primary dark:text-linen' : 'hover:text-slate-900 dark:hover:text-white'}`}>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <Link to="/donate" className="shrink-0 rounded-full bg-gradient-to-r from-honey to-primary px-4 py-3 text-sm font-black text-white shadow-lg shadow-honey/20 transition hover:from-clay hover:to-primary xl:px-5">
                        Donate Now
                    </Link>
                    <Link to="/admin" className="shrink-0 rounded-full border border-slate-200/80 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-linen dark:hover:text-linen xl:px-5">
                        Admin Login
                    </Link>
                    <button onClick={toggleTheme} className="shrink-0 rounded-full border border-slate-200/80 bg-white px-3 py-3 text-slate-700 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                        {theme === 'light' ? <FaMoon size={16} /> : <FaSun size={16} />}
                    </button>
                </div>

                <div className="flex shrink-0 items-center gap-2 lg:hidden">
                    <button onClick={toggleTheme} aria-label="Toggle theme" className="rounded-full border border-slate-200/80 bg-white p-3 text-slate-700 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                        {theme === 'light' ? <FaMoon size={16} /> : <FaSun size={16} />}
                    </button>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-900 shadow-sm transition hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-linen dark:hover:text-linen"
                    >
                        {isMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
                    </button>
                </div>
            </div>

            <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'} border-t border-slate-200/70 bg-white dark:border-slate-800/70 dark:bg-clay`}>
                <div className="space-y-4 px-6 py-6">
                    {links.map(link => (
                        <Link key={link.name} to={link.path} onClick={closeMenu} className="block text-lg font-medium text-slate-700 dark:text-slate-200 hover:text-primary">
                            {link.name}
                        </Link>
                    ))}
                    <Link to="/donate" onClick={closeMenu} className="block rounded-full bg-gradient-to-r from-honey to-primary px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-honey/20">
                        Donate Now
                    </Link>
                    <Link to="/admin" onClick={closeMenu} className="block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                        Admin Login
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
