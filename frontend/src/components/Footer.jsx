import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import PhoneAction from './PhoneAction';

const Footer = () => {
    return (
        <footer className="border-t border-black/20 bg-clay text-white/85">
            <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-4 lg:px-12">
                <div className="space-y-4">
                    <img src="/footor-1.svg" alt="Pyaar Foundation" className="h-16 w-16 rounded-2xl bg-white object-contain" />
                    <p className="text-sm leading-relaxed text-white/75">
                        We rescue, rehabilitate, vaccinate, sterilise, and rehome animals with dignity, urgency, and transparent community support.
                    </p>
                    <div className="flex items-center gap-4 text-white/75">
                        <a href="https://www.facebook.com/petanity/" className="hover:text-white transition"><FaFacebook size={18} /></a>
                        <a href="https://x.com/pyaarfoundation?" className="hover:text-white transition"><FaTwitter size={18} /></a>
                        <a href="https://www.instagram.com/pyaar_rescue_shelter/" className="hover:text-white transition"><FaInstagram size={18} /></a>
                        <a href="https://www.youtube.com/@pyaarfoundation" className="hover:text-white transition"><FaYoutube size={18} /></a>
                    </div>
                </div>
                <div>
                    <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-white mb-6">Quick Links</h4>
                    <ul className="space-y-3 text-sm text-white/75">
                        <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                        <li><Link to="/gallery" className="hover:text-white transition">Gallery</Link></li>
                        <li><Link to="/donate" className="hover:text-white transition">Donate</Link></li>
                        <li><Link to="/donation-schema" className="hover:text-white transition">Donation Schemes</Link></li>
                        <li><Link to="/team" className="hover:text-white transition">Volunteer</Link></li>
                        <li><Link to="/sponsors" className="hover:text-white transition">Sponsors</Link></li>
                        <li><Link to="/events" className="hover:text-white transition">Events</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-white mb-6">Programs</h4>
                    <ul className="space-y-3 text-sm text-white/75">
                        <li><Link to="/service" className="hover:text-white transition">Rescue</Link></li>
                        <li><Link to="/adoption" className="hover:text-white transition">Adoption</Link></li>
                        <li><Link to="/events" className="hover:text-white transition">Events</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-white mb-6">Contact</h4>
                    <ul className="space-y-3 text-sm text-white/75">
                        <li>C/O Dr. Devendra Rapelli</li>
                        <li>Pyaar Foundation</li>
                        <li>Petanity And Animal Rehabilitators Foundation Chandrapur.</li>
                        <li>Animal welfare organisation</li>
                        <li>Near pipeline, vichoda bujruk</li>
                        <li>Chandrapur Maharashtra 442406</li>
                        <li><a href="mailto:Pyaar4petanity@gmail.com" className="hover:text-white transition">Pyaar4petanity@gmail.com</a></li>
                        <li><a href="mailto:workpyaar@gmail.com" className="hover:text-white transition">workpyaar@gmail.com</a></li>
                        <li><PhoneAction number="+91 9422567030" className="hover:text-white transition" /></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-black/20 py-6 text-center text-sm text-white/60">
                &copy; {new Date().getFullYear()} Pyaar Foundation. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
