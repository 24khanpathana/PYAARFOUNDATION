import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Sponsors = () => {
    const [sponsors, setSponsors] = useState([]);

    useEffect(() => {
        document.title = 'Sponsors | Pyaar Foundation';
        api.get('/api/sponsors')
            .then(res => setSponsors(res.data))
            .catch(() => setSponsors([]));
    }, []);

    return (
        <div className="min-h-screen w-full bg-mist pb-20 font-sans text-slate-800">
            <div className="mb-16 bg-clay px-4 py-16 text-center text-white md:py-24">
                <span className="mb-4 inline-block text-sm font-bold uppercase tracking-[0.3em] text-primary">Sponsor community</span>
                <h1 className="mb-4 text-4xl font-black md:text-6xl">Our Sponsors</h1>
                <p className="mx-auto max-w-2xl text-lg text-slate-300 md:text-xl">Partners who help us continue rescue, rehabilitation, feeding, and medical care with consistency.</p>
            </div>

            <div className="mx-auto max-w-7xl px-6">
                {sponsors.length > 0 && (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {sponsors.map(sponsor => (
                            <article key={sponsor._id} className="rounded-[1.5rem] border border-white bg-white p-5 shadow-xl shadow-slate-200/50 transition duration-300 hover:-translate-y-1">
                                <img src={sponsor.imageUrl || '/footor-1.svg'} alt={sponsor.name} className="aspect-square w-full rounded-2xl object-cover" />
                                <h3 className="mt-5 text-2xl font-black text-slate-950">{sponsor.name}</h3>
                                {sponsor.organization && <p className="mt-1 text-sm font-bold uppercase tracking-[0.16em] text-primary">{sponsor.organization}</p>}
                                <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-600">{sponsor.description}</p>
                                {sponsor.link && (
                                    <a href={sponsor.link} target="_blank" rel="noreferrer" className="mt-5 inline-flex font-bold text-primary hover:text-primaryHover">
                                        Visit sponsor
                                    </a>
                                )}
                            </article>
                        ))}
                    </div>
                )}

                {!sponsors.length && (
                    <div className="mx-auto mt-12 max-w-2xl rounded-[1.5rem] border border-white bg-white p-8 text-center shadow-xl shadow-slate-200/50">
                        <h2 className="text-2xl font-black text-slate-950">Sponsor profiles are coming soon.</h2>
                        <p className="mt-3 text-slate-600">Interested partners can contact the Pyaar Foundation team directly.</p>
                        <Link to="/contact" className="btn-primary mt-6">Contact Us</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sponsors;
