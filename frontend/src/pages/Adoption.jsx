import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Adoption = () => {
    const [animals, setAnimals] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/api/animals')
            .then(res => setAnimals(res.data))
            .catch(err => console.error('Error fetching animals:', err));
    }, []);

    const handleAdoptClick = (animalName) => {
        const whatsappNumber = '9422567030';
        const message = `Hello, I have an enquiry for the adoption of ${animalName} from your NGO.`;
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, '_blank');
    };

    const storyAnimals = [
        {
            name: 'Delta',
            tag: 'The Guardian of Our Shelter',
            text: 'Delta journey is a powerful story of courage and resilience. Despite losing part of his foot in a train accident, he healed with love and care to become our shelter fearless guardian-a gentle, loyal soul who proves that true strength comes from an unbreakable spirit and a heart full of love.',
            image: '/delta.jpeg',
        },
        {
            name: 'Veera',
            tag: 'Strength Reborn',
            text: 'Veera is a true symbol of resilience, overcoming a devastating leg fracture through dedicated care, patience, and his own fighting spirit. Today, this majestic Gir bull stands strong and healthy, inspiring everyone with the powerful reminder that love and compassion can turn even the darkest moments into stories of hope.',
            image: '/veera.jpeg',
        },
        {
            name: 'Rose',
            tag: 'The Fearless Guardian',
            text: 'Rose is a remarkable cat whose journey transformed from fear and aggression to trust and love through patience and compassionate care. Despite his injured foot, this beautiful odd-eyed feline is now a cherished member of our shelter family, protecting those around him with a heart full of courage.',
            image: '/rose.jpeg',
        },
    ];

    return (
        <div className="w-full font-sans text-gray-800 bg-[#FAFAFA] min-h-screen pb-20">
            <div className="bg-clay text-white py-20 px-6 text-center border-b border-clay shadow-inner">
                <span className="text-linen font-bold tracking-widest uppercase text-sm mb-4 inline-block">Their Second Chance</span>
                <h1 className="text-4xl md:text-6xl font-serif font-black mb-6 tracking-tight">Adopt a Best Friend.</h1>
                <p className="text-lg md:text-xl text-mist max-w-3xl mx-auto leading-relaxed">
                    They have survived abandonment, accidents, and cruelty. Now, they are just looking for a soft place to land. Browse our available animals below and find your perfect companion.
                </p>
            </div>

            <section className="max-w-7xl mx-auto px-6 mt-20 text-left">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Ready for Adoption</h2>
                    <p className="text-gray-500 text-lg">Open your heart and home to a rescued friend.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {animals.map(animal => (
                        <div key={animal._id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 flex flex-col group">
                            <div className="overflow-hidden h-72">
                                <img src={animal.imageUrl} alt={animal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="text-3xl font-bold text-gray-900">{animal.name}</h2>
                                    <span className="bg-linen/35 text-clay text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">{animal.breed}</span>
                                </div>
                                <p className="text-sm text-gray-500 mb-6 font-medium">Age: {animal.age}</p>
                                <p className="text-gray-600 leading-relaxed mb-8 flex-grow">{animal.description}</p>

                                <button
                                    onClick={() => handleAdoptClick(animal.name)}
                                    className="w-full bg-honey hover:bg-clay text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-honey/20"
                                >
                                    Adopt Me
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {animals.length === 0 && (
                    <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm max-w-2xl mx-auto">
                        <p className="text-gray-500 text-lg font-medium">No animals are currently listed for adoption online. Please contact us directly or check back soon!</p>
                    </div>
                )}
            </section>

            <section className="bg-sand/20 mt-24 py-24 px-6 border-t border-sand/40">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Stories of Resilience</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Not every animal is ready for adoption yet. Some of our rescues require ongoing sponsorship, while others have already found their happily-ever-after. Read their incredible journeys.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {storyAnimals.map((animal, idx) => (
                            <div key={idx} className="bg-white card !p-0 overflow-hidden flex flex-col group border border-gray-100 hover:border-primary/30 transition-all duration-300 shadow-lg">
                                <div className="relative overflow-hidden h-72">
                                    <img src={animal.image} alt={animal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                        {animal.tag}
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex justify-between items-end mb-4">
                                        <h2 className="text-3xl font-black text-gray-900">{animal.name}</h2>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed mb-8 flex-grow">{animal.text}</p>

                                    <button onClick={() => navigate('/donate')} className="w-full bg-honey hover:bg-clay text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-honey/20">
                                        Sponsor Their Care
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Adoption;
