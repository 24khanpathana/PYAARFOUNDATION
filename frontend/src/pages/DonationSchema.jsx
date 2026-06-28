import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const DonationSchema = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const legacyDonationPageName = ['Donation', 'Schema'].join(' ');
    const donationPageNames = ['Donation Schemes', legacyDonationPageName];

    useEffect(() => {
        api.get('/api/content')
            .then((res) => {
                const donationItems = res.data.filter((item) => donationPageNames.includes(item.page));
                setCards(donationItems.map((item) => ({
                    id: item._id,
                    title: item.title,
                    amount: item.amount || 'Custom support',
                    description: item.description || 'Support the mission with compassion and care.',
                    imageUrl: item.imageUrl || '',
                })));
            })
            .catch(() => setCards([]));
    }, []);

    return (
        <div className="min-h-screen bg-[#FAFAFA] pb-20 font-sans text-gray-800">
            <div className="border-b border-clay bg-clay px-6 py-20 text-center text-white shadow-inner">
                <span className="mb-4 inline-block text-sm font-bold uppercase tracking-[0.28em] text-linen">Donation schemes</span>
                <h1 className="mb-6 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">Choose a Donation Option</h1>
                <p className="mx-auto max-w-3xl text-lg leading-8 text-mist">
                    Every contribution helps animals move from suffering to safety, treatment, and a second chance at life.
                </p>
            </div>

            <section className="mx-auto mt-20 max-w-7xl px-6">
                <div className="mb-12 text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">Support options</p>
                    <h2 className="mt-4 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">Select a donation path that fits your kindness</h2>
                </div>

                {cards.length === 0 ? (
                    <div className="rounded-3xl border border-gray-100 bg-white p-10 text-center shadow-xl shadow-slate-200/60">
                        <p className="text-lg font-bold text-gray-700">Donation options will appear here once they are added from the admin panel.</p>
                    </div>
                ) : (
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {cards.map((item) => (
                        <div key={item.id || item.title} className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-xl shadow-slate-200/60 transition duration-300 hover:-translate-y-1">
                            {item.imageUrl && (
                                <div className="h-64 overflow-hidden">
                                    <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
                                </div>
                            )}
                            <div className="p-8">
                                <div className="mb-4 flex items-center justify-between gap-3">
                                    <h3 className="text-2xl font-black text-gray-900">{item.title}</h3>
                                    <span className="text-2xl font-black text-gray-900">{item.amount}</span>
                                </div>
                                <p className="mt-4 leading-7 text-gray-600">{item.description}</p>
                                <button onClick={() => navigate('/donate')} className="mt-6 rounded-full bg-clay px-5 py-3 text-sm font-bold text-white transition hover:bg-honey">
                                    Donate Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                )}
            </section>
        </div>
    );
};

export default DonationSchema;
