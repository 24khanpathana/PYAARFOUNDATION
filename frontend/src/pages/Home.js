import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import DynamicContentRenderer from '../components/DynamicContentRenderer';
import PhoneAction from '../components/PhoneAction';
import {
    FaAmbulance,
    FaArrowRight,
    FaCheckCircle,
    FaHandHoldingHeart,
    FaHandsHelping,
    FaHome,
    FaPhoneAlt,
    FaShieldAlt,
    FaStethoscope,
    FaSyringe,
    FaUsers,
} from 'react-icons/fa';

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
};

const impactStats = [
    { value: '65K+', label: 'lives touched through care' },
    { value: '1L+', label: 'rescues and field responses' },
    { value: '3,000+', label: 'resident animals supported' },
    { value: '500+', label: 'successful adoptions' },
];

const programs = [
    {
        icon: FaAmbulance,
        title: 'Emergency Rescue',
        text: 'Rapid response for accident, abuse, abandonment, and critical trauma cases across the city.',
        image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80',
    },
    {
        icon: FaStethoscope,
        title: 'Medical Rehabilitation',
        text: 'Veterinary care, surgeries, wound management, recovery spaces, and long-term rehabilitation.',
        image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=900&q=80',
    },
    {
        icon: FaSyringe,
        title: 'ABC and Vaccination',
        text: 'Humane sterilisation and rabies vaccination to reduce suffering and human-animal conflict.',
        image: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&w=900&q=80',
    },
    {
        icon: FaHandsHelping,
        title: 'Volunteer Outreach',
        text: 'Hands-on animal care, rescue support, awareness drives, and community coordination for people who want to help.',
        image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=900&q=80',
    },
    {
        icon: FaHandHoldingHeart,
        title: 'Adoption Support',
        text: 'Responsible adoption guidance that helps recovered animals find patient, loving, and prepared families.',
        image: '/rose.jpeg',
    },
    {
        icon: FaShieldAlt,
        title: 'Shelter Essentials',
        text: 'Food, water, bedding, cleaning supplies, enclosure repairs, and special diets for animals who live with us.',
        image: 'https://images.unsplash.com/photo-1601758177266-bc599de87707?auto=format&fit=crop&w=900&q=80',
    },
];

const stories = [
    {
        name: 'Delta',
        tag: 'The Guardian of Our Shelter',
        text: 'Delta journey is a powerful story of courage and resilience. Despite losing part of his foot in a train accident, he healed with love and care to become our shelter fearless guardian—a gentle, loyal soul who proves that true strength comes from an unbreakable spirit and a heart full of love.',
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

const campaigns = [
    { amount: 'Rs. 1,00,000', title: 'Rescue response goal', text: 'Ambulance movement, emergency handling, and urgent first care.' },
    { amount: 'Rs. 10,00,000', title: 'Medical treatment goal', text: 'Surgeries, diagnostics, dressings, medicines, and hospitalisation.' },
    { amount: 'Rs. 8,50,000', title: 'Daily essentials goal', text: 'Food, water, bedding, hygiene, shelter repairs, and special diets.' },
];

const dailyNeeds = [
    'Fresh fodder, grains, vegetables, and recovery diets',
    'Medicines, antiseptics, bandages, and supplements',
    'Warm bedding, mats, cleaning supplies, and enclosure repairs',
    'Fresh drinking water, tubs, storage containers, and hydration support',
];

const galleryImages = [
    '/delta.jpeg',
    '/rose.jpeg',
    '/veera.jpeg',
    '/donation schemes.jpeg',
];

const Home = () => {
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [sponsors, setSponsors] = useState([]);
    const [contactData, setContactData] = useState({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
    const [contactMsg, setContactMsg] = useState('');

    useEffect(() => {
        document.title = 'Pyaar Foundation | Rescue, Rehab, Adoption';
        api.get('/api/animals')
            .then(res => setPets(res.data.slice(0, 4)))
            .catch(() => setPets([]));
        api.get('/api/sponsors')
            .then(res => setSponsors(res.data.slice(0, 4)))
            .catch(() => setSponsors([]));
    }, []);

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/feedback', {
                name: contactData.name,
                email: contactData.email,
                feedback: `Subject: ${contactData.subject} | Phone: ${contactData.phone} | Message: ${contactData.message}`,
            });
            setContactMsg('Thank you. Our team has received your message and will respond soon.');
            setContactData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
        } catch (error) {
            setContactMsg('Something went wrong. Please try again or call our team directly.');
        }
    };

    return (
        <div className="w-full overflow-hidden bg-mist text-slate-900">
            <section className="relative -mt-24 flex min-h-screen items-center overflow-hidden px-6 pt-32 text-white sm:px-8 lg:px-12">
                <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover">
                    <source src="/BG.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-br from-black/78 via-clay/82 to-black/72" />
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-mist to-transparent" />

                <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.75 }} className="max-w-3xl">
                        <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-black/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-linen backdrop-blur">
                            <span className="h-2 w-2 rounded-full bg-honey" />
                            Compassion in action
                        </div>
                        <h1 className="text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
                            Rescue is only the beginning of love.
                        </h1>
                        <p className="mt-8 max-w-2xl text-lg leading-8 text-white/90 sm:text-xl">
                            Pyaar Foundation heals injured, abandoned, and voiceless animals through emergency rescue, medical rehabilitation, adoption, and community education.
                        </p>
                        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                            <button onClick={() => navigate('/donate')} className="btn-primary bg-gradient-to-r from-honey via-linen to-primary px-8 py-4 text-slate-950 hover:from-clay hover:to-linen">
                                Donate Now <FaArrowRight />
                            </button>
                            <button onClick={() => navigate('/service')} className="btn-secondary border-white/20 bg-white/10 px-8 py-4 text-white hover:bg-white/20">
                                Volunteer With Us
                            </button>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="rounded-[2rem] border border-white/20 bg-black/20 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl">
                        <div className="rounded-[1.5rem] bg-black/35 p-6">
                            <div className="grid grid-cols-2 gap-4">
                                {impactStats.map(stat => (
                                    <div key={stat.label} className="rounded-2xl border border-white/15 bg-white/[0.08] p-5">
                                        <p className="text-3xl font-black text-white sm:text-4xl">{stat.value}</p>
                                        <p className="mt-2 text-sm leading-6 text-white/80">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })} className="mt-5 flex w-full items-center gap-4 rounded-2xl border border-honey/25 bg-black/25 p-4 text-left transition hover:bg-black/35">
                                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-honey text-white"><FaPhoneAlt /></span>
                                <span>
                                    <span className="block text-xs font-bold uppercase tracking-[0.24em] text-linen">Animal emergency?</span>
                                    <span className="font-semibold text-white">Report a rescue case now</span>
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} transition={{ duration: 0.65 }} className="mx-auto -mt-16 max-w-7xl px-6 lg:px-12">
                        <div className="grid gap-5 rounded-[2rem] border border-black/10 bg-white/90 p-5 shadow-2xl shadow-black/10 backdrop-blur md:grid-cols-4">
                    {impactStats.map(stat => (
                        <div key={stat.label} className="rounded-3xl bg-gradient-to-br from-white to-primary/10 p-6 text-center">
                            <p className="text-4xl font-black text-slate-950">{stat.value}</p>
                            <p className="mt-2 text-sm font-medium text-slate-500">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </motion.section>

            <section className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
                <div className="grid gap-8 rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/60 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">Donation schemes</p>
                        <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Support rescue, rehabilitation, and lasting care.</h2>
                        <p className="mt-5 text-lg leading-8 text-slate-600">Explore meaningful support paths such as One Jeev Abhadan, Annual Adoption, Lifetime Adoption, Sponsor a Fruit Party for Gauvansh, Kayami Tithi, Wall of Honours, and Lifetime Sponsors.</p>
                        <button onClick={() => navigate('/donation-schema')} className="mt-8 rounded-full bg-clay px-6 py-3 text-sm font-bold text-white transition hover:bg-honey">View Donation Schemes</button>
                    </div>
                    <div className="overflow-hidden rounded-[1.8rem] border border-slate-200">
                        <img src="/donation-schemes.jpeg" alt="Donation support" className="h-full w-full object-cover" />
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
                <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                    <div className="max-w-3xl">
                        <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">Featured initiatives</p>
                        <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Care that moves from street to surgery to home.</h2>
                    </div>
                    <Link to="/service" className="btn-secondary">Explore Programs <FaArrowRight /></Link>
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                    {programs.map((program, index) => (
                        <motion.article key={program.title} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} transition={{ duration: 0.55, delay: index * 0.08 }} className="group overflow-hidden rounded-[2rem] border border-white bg-white shadow-xl shadow-slate-200/60">
                            <div className="relative h-64 overflow-hidden">
                                <img src={program.image} alt={program.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                                <div className="absolute bottom-5 left-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary shadow-lg">
                                    <program.icon size={22} />
                                </div>
                            </div>
                            <div className="p-7">
                                <h3 className="text-2xl font-black text-slate-950">{program.title}</h3>
                                <p className="mt-4 leading-7 text-slate-600">{program.text}</p>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-12">
                <div className="grid items-center gap-10 rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/50 lg:grid-cols-[0.85fr_1.15fr] lg:p-12">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">Our daily needs</p>
                        <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950">Be a lifeline for rescued animals.</h2>
                        <p className="mt-5 text-lg leading-8 text-slate-600">Every day, animals in our care depend on food, medical supplies, clean shelter, and safe water. Small recurring help keeps the whole rescue system moving.</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {dailyNeeds.map(need => (
                            <div key={need} className="rounded-2xl border border-primary/20 bg-primary/10 p-5 font-semibold leading-7 text-slate-700">
                                {need}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-clay px-6 py-24 text-white lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.28em] text-linen">Donation campaigns</p>
                            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Every scan becomes food, medicine, and recovery time.</h2>
                            <p className="mt-6 text-lg leading-8 text-slate-300">We have removed payment gateway complexity. Donate through a transparent UPI QR flow, then share your transaction reference for acknowledgement.</p>
                            <button onClick={() => navigate('/donate')} className="btn-primary mt-8 bg-white text-slate-950 hover:bg-primary/10">Open QR Donation</button>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-3">
                            {campaigns.map(campaign => (
                                <div key={campaign.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
                                    <p className="text-3xl font-black text-honey">{campaign.amount}</p>
                                    <h3 className="mt-5 text-xl font-bold">{campaign.title}</h3>
                                    <p className="mt-3 text-sm leading-6 text-slate-300">{campaign.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
                <div className="mb-12 text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">Success stories</p>
                    <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Proof that care can rewrite an ending.</h2>
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                    {stories.map(story => (
                        <article key={story.name} className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/60">
                            <img src={story.image} alt={story.name} loading="lazy" className="h-72 w-full object-cover" />
                            <div className="p-7">
                                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">{story.tag}</span>
                                <h3 className="mt-5 text-3xl font-black text-slate-950">{story.name}</h3>
                                <p className="mt-4 leading-7 text-slate-600">{story.text}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="bg-white px-6 py-24 lg:px-12">
                <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1fr]">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">Adoption and shelter</p>
                        <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Meet animals waiting for a family.</h2>
                        <p className="mt-6 text-lg leading-8 text-slate-600">Every adoption creates space for the next rescue. Browse profiles, book a visit, or sponsor long-term care for animals who cannot be released.</p>
                        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                            <Link to="/adoption" className="btn-primary">View Adoptables</Link>
                            <Link to="/contact" className="btn-secondary">Contact the Team</Link>
                        </div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        {pets.length > 0 ? pets.map(pet => (
                            <div key={pet._id} className="rounded-[1.5rem] border border-slate-100 bg-mist p-4">
                                <img src={pet.imageUrl} alt={pet.name} loading="lazy" className="h-48 w-full rounded-2xl object-cover" />
                                <h3 className="mt-4 text-xl font-black">{pet.name}</h3>
                                <p className="text-sm text-slate-500">{pet.breed || pet.age}</p>
                            </div>
                        )) : galleryImages.slice(0, 4).map((image, index) => (
                            <div key={image} className="rounded-[1.5rem] border border-slate-100 bg-mist p-4">
                                <img src={image} alt={`Rescue preview ${index + 1}`} loading="lazy" className="h-48 w-full rounded-2xl object-cover" />
                                <h3 className="mt-4 text-xl font-black">{['Hope', 'Care', 'Shelter', 'Family'][index]}</h3>
                                <p className="text-sm text-slate-500">Rescue life at Pyaar Foundation</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-mist px-6 py-24 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                        <div className="max-w-3xl">
                            <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">Sponsor support</p>
                            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Our Top 4 Sponsors</h2>
                            <p className="mt-5 text-lg leading-8 text-slate-600">Support from our sponsors helps us continue rescuing, caring, and providing better lives for animals.</p>
                        </div>
                        <Link to="/sponsors" className="btn-secondary">View All Sponsors <FaArrowRight /></Link>
                    </div>
                    {sponsors.length > 0 ? (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {sponsors.map(sponsor => (
                                <article key={sponsor._id} className="rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-xl shadow-slate-200/50 transition duration-300 hover:-translate-y-1">
                                    <img src={sponsor.imageUrl || '/footor-1.svg'} alt={sponsor.name} loading="lazy" className="aspect-square w-full rounded-2xl object-cover" />
                                    <h3 className="mt-4 text-xl font-black text-slate-950">{sponsor.name}</h3>
                                    {sponsor.organization && <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-primary">{sponsor.organization}</p>}
                                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{sponsor.description}</p>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-[1.5rem] border border-white bg-white p-8 text-center shadow-xl shadow-slate-200/50">
                            <h3 className="text-2xl font-black text-slate-950">Sponsor profiles are coming soon.</h3>
                            <p className="mx-auto mt-3 max-w-2xl text-slate-600">Sponsors added from the admin panel will appear here automatically.</p>
                        </div>
                    )}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
                <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">Gallery preview</p>
                        <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950">Small moments. Massive meaning.</h2>
                        <p className="mt-6 text-lg leading-8 text-slate-600">From first meals after rescue to final adoption walks, our gallery keeps the mission visible and accountable.</p>
                        <Link to="/gallery" className="btn-secondary mt-8">Open Gallery <FaArrowRight /></Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {galleryImages.map((image, index) => (
                            <img key={image} src={image} alt={`Pyaar Foundation gallery ${index + 1}`} loading="lazy" className={`h-56 w-full rounded-[1.5rem] object-cover shadow-xl shadow-slate-200/60 ${index % 2 ? 'mt-8' : ''}`} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-gradient-to-br from-primary/10 via-mist to-linen/25 px-6 py-24 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {[
                            ['Volunteer Program', 'Join rescue transport, adoption coordination, feeding drives, content support, or school awareness.'],
                            ['Testimonials', 'Donors and adopters trust our team because we keep care visible, responsive, and deeply personal.'],
                            ['Partners', 'Clinics, schools, local businesses, and community groups help us scale compassion city-wide.'],
                        ].map(([title, text]) => (
                            <div key={title} className="rounded-[2rem] border border-white bg-white/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur">
                                <FaHandsHelping className="text-3xl text-primary" />
                                <h3 className="mt-6 text-2xl font-black text-slate-950">{title}</h3>
                                <p className="mt-4 leading-7 text-slate-600">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <DynamicContentRenderer
                page="Home"
                title="More From Pyaar Foundation"
                subtitle="Content added from the admin panel appears here automatically."
            />

            <section id="contact-section" className="bg-white px-6 py-24 lg:px-12">
                <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr]">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">Get in touch</p>
                        <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">Report, volunteer, donate, or partner with us.</h2>
                        <div className="mt-8 space-y-4">
                            {[
                                [FaHome, 'Near pipeline Vichoda, Chhota Nagpur,Chandrapur,Maharashtra,442406'],
                                [FaPhoneAlt, '+91 94225 67030', true],
                                [FaPhoneAlt, '+91 75888 93939', true],
                                [FaShieldAlt, 'pyaar4petanity@gmail.com'],
                            ].map(([Icon, text, isPhone]) => (
                                <div key={text} className="flex items-center gap-4 rounded-2xl bg-mist p-4">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary"><Icon /></span>
                                    {isPhone ? <PhoneAction number={text} /> : <span className="font-semibold text-slate-700">{text}</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-[2rem] border border-slate-100 bg-mist p-6 shadow-xl shadow-slate-200/50">
                        {contactMsg ? (
                            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                                <FaCheckCircle className="text-5xl text-primary" />
                                <h3 className="mt-6 text-2xl font-black text-slate-950">Message received</h3>
                                <p className="mt-3 max-w-md text-slate-600">{contactMsg}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleContactSubmit} className="grid gap-5">
                                <div className="grid gap-5 md:grid-cols-2">
                                    <input type="text" required value={contactData.name} onChange={e => setContactData({ ...contactData, name: e.target.value })} className="input-field" placeholder="Full name" />
                                    <input type="email" required value={contactData.email} onChange={e => setContactData({ ...contactData, email: e.target.value })} className="input-field" placeholder="Email address" />
                                </div>
                                <div className="grid gap-5 md:grid-cols-2">
                                    <input type="tel" required value={contactData.phone} onChange={e => setContactData({ ...contactData, phone: e.target.value })} className="input-field" placeholder="Phone number" />
                                    <select value={contactData.subject} onChange={e => setContactData({ ...contactData, subject: e.target.value })} className="input-field">
                                        <option>General Inquiry</option>
                                        <option>Animal Emergency</option>
                                        <option>Donation</option>
                                        <option>Volunteer</option>
                                        <option>Adoption</option>
                                    </select>
                                </div>
                                <textarea required rows="5" value={contactData.message} onChange={e => setContactData({ ...contactData, message: e.target.value })} className="input-field resize-none" placeholder="Tell us how we can help." />
                                <button type="submit" className="btn-primary w-full py-4">Send Message</button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
