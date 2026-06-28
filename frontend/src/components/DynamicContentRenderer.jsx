import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const DynamicContentRenderer = ({ page, position, title = 'Latest Updates', subtitle }) => {
    const [content, setContent] = useState([]);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const { data } = await api.get('/api/content');
                const filteredContent = data.filter(item => {
                    if (page) return item.page === page;
                    return item.position === position;
                });
                setContent(filteredContent);
            } catch (error) {
                setContent([]);
            }
        };

        fetchContent();
    }, [page, position]);

    if (content.length === 0) return null;

    return (
        <section className="bg-white px-6 py-24 lg:px-12">
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 max-w-3xl">
                    <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">Admin updates</p>
                    <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{title}</h2>
                    {subtitle && <p className="mt-5 text-lg leading-8 text-slate-600">{subtitle}</p>}
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {content.map((item, index) => (
                        <motion.article
                            key={item._id}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.45, delay: index * 0.06 }}
                            className="overflow-hidden rounded-[2rem] border border-slate-100 bg-mist shadow-xl shadow-slate-200/50"
                        >
                            {item.imageUrl && (
                                <img src={item.imageUrl} alt={item.title} loading="lazy" className="h-64 w-full object-cover" />
                            )}
                            <div className="p-7">
                                {(item.role || item.date) && (
                                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                                        {item.role || new Date(item.date).toLocaleDateString()}
                                    </p>
                                )}
                                <h3 className="text-2xl font-black text-slate-950">{item.title}</h3>
                                {item.description && <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-600">{item.description}</p>}
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DynamicContentRenderer;
