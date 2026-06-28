import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Gallery = () => {
    const [content, setContent] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Gallery | Pyaar Foundation';
        api.get('/api/content')
            .then(res => {
                setContent(res.data.filter(c => c.page === 'Gallery'));
            })
            .catch(err => console.error('Error fetching gallery content:', err));
    }, []);

    return (
        <div className="min-h-screen w-full bg-mist pb-20 font-sans text-slate-800">
            <div className="relative overflow-hidden bg-clay px-6 py-24 text-center text-white shadow-inner">
                <span className="mb-4 inline-block text-sm font-bold uppercase tracking-[0.3em] text-linen">Moments of hope</span>
                <h1 className="mb-6 text-4xl font-black tracking-tight md:text-6xl">Our Gallery</h1>
                <p className="mx-auto max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
                    Photos and stories showcasing the work of Pyaar Foundation and the animals whose lives have been transformed through compassion and care.
                </p>
            </div>
            <section className="max-w-7xl mx-auto px-6 mt-20 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {content.map(item => (
                        <div key={item._id} className="group flex flex-col overflow-hidden rounded-[2rem] border border-white bg-white shadow-xl shadow-slate-200/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                            <div className="relative overflow-hidden h-72">
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-primary/10 font-bold text-primary">
                                        Pyaar Foundation
                                    </div>
                                )}
                            </div>
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex justify-between items-end mb-4">
                                    <h2 className="text-3xl font-black text-gray-900">{item.title}</h2>
                                </div>
                                {(item.role || item.date) && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {item.role && <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">{item.role}</span>}
                                        {item.date && <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">{new Date(item.date).toLocaleDateString()}</span>}
                                    </div>
                                )}
                                <p className="text-gray-600 leading-relaxed mb-8 flex-grow whitespace-pre-wrap">{item.description}</p>
                                <button onClick={() => navigate('/donate')} className="w-full bg-honey hover:bg-clay text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-honey/20">
                                    Support Our Work
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {content.length === 0 && (
                    <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm max-w-2xl mx-auto mt-10">
                        <p className="text-gray-500 text-lg font-medium">No gallery items have been published yet. Please check back later!</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Gallery;
