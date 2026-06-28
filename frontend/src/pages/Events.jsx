import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaHandsHelping, FaHeart } from 'react-icons/fa';
import api from '../utils/api';

const Events = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);

    // Fetch dynamic events from the backend
    useEffect(() => { 
        document.title = 'Events | Pyaar Foundation';
        api.get('/api/content')
            .then(res => setEvents(res.data.filter(c => c.page === 'Event')))
            .catch(err => console.error("Error fetching events:", err));
    },[]);

    return (
        <div className="min-h-screen w-full bg-white">
            
            {/* 1. Header Section */}
            <div className="relative overflow-hidden bg-clay px-6 py-28 text-center text-white">
                <div className="absolute inset-0 opacity-20">
                    <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80" alt="" className="h-full w-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-clay/75 to-clay" />
                <div className="relative">
                <span className="mb-4 inline-block text-sm font-bold uppercase tracking-[0.3em] text-linen">
                    Feeding drive awareness initiative
                </span>
                <h1 className="mb-6 text-4xl font-black tracking-tight md:text-6xl">
                    Fostering Empathy Early.
                </h1>
                <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
                    Treating wounded animals is a cure, but education is the prevention. Through our "Feeding drive" awareness campaigns, we are shaping the next generation to value all living beings.
                </p>
                </div>
            </div>

            {/* 2. Story & Details Section */}
            <section className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Images */}
                    <div className="grid grid-cols-2 gap-4">
                        <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=400&q=80" alt="Education" className="rounded-3xl w-full h-72 object-cover shadow-lg" />
                        <img src="https://images.unsplash.com/photo-1601758228041-f3b279ce7bec?auto=format&fit=crop&w=400&q=80" alt="Compassion" className="rounded-3xl w-full h-72 object-cover shadow-lg mt-12" />
                    </div>
                    
                    {/* Text & Impact */}
                    <div className="space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                            Building a future where coexistence becomes a <span className="text-primary">language of understanding.</span>
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            A significant amount of animal abuse stems from fear and a lack of understanding. We conduct "Feeding drive" events at schools to teach children responsible animal care, rabies awareness, and how to understand animal behaviour.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            By ingraining these values from an early age, we strive to drastically reduce human-animal conflicts in the future.
                        </p>
                        
                        <div className="pt-6 border-t border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">How you can get involved:</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center text-gray-700 font-medium">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4"><FaGraduationCap /></div>
                                    Invite us to your school or college
                                </li>
                                <li className="flex items-center text-gray-700 font-medium">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4"><FaHandsHelping /></div>
                                    Volunteer as an awareness speaker
                                </li>
                                <li className="flex items-center text-gray-700 font-medium">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4"><FaHeart /></div>
                                    Sponsor educational materials
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Dynamic Events Fetching Section (Merged Code) */}
            <section className="bg-gray-50 py-24 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Upcoming Events & Campaigns</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Join us at our upcoming Feeding drive awareness drives and animal welfare events happening across the region.
                        </p>
                    </div>

                    {events.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {events.map(event => (
                                <div key={event._id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 flex flex-col group">
                                    {event.imageUrl ? (
                                        <div className="overflow-hidden">
                                            <img src={event.imageUrl} alt={event.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    ) : (
                                        <div className="w-full h-56 bg-linen/35 flex items-center justify-center">
                                            <span className="text-clay font-bold opacity-50">Pyaar Foundation Event</span>
                                        </div>
                                    )}
                                    <div className="p-8 flex-grow flex flex-col">
                                        {event.date && (
                                            <p className="text-honey font-bold tracking-widest uppercase text-xs mb-3">
                                                {new Date(event.date).toDateString()}
                                            </p>
                                        )}
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-snug">{event.title}</h3>
                                        <p className="text-gray-600 leading-relaxed flex-grow">{event.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm">
                            <p className="text-gray-500 text-lg font-medium">There are currently no upcoming events. Please check back soon!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* 4. Final CTA */}
            <section className="bg-clay py-24 px-6 text-center text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Host a Feeding drive</h2>
                <p className="text-gray-400 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
                    Want to bring our awareness programme to your community, corporate office, or educational institution?
                </p>
                <button onClick={() => navigate('/contact')} className="btn-primary px-10 py-4 text-lg shadow-xl shadow-primary/20">
                    Contact Us to Partner
                </button>
            </section>

        </div>
    );
};

export default Events;
