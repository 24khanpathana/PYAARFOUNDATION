import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaHandHoldingHeart, FaQuoteLeft, FaShieldAlt, FaStethoscope, FaUsers } from 'react-icons/fa';
import DynamicContentRenderer from '../components/DynamicContentRenderer';

const pillars = [
    ['Mission', 'To create a city where injured and abandoned animals receive timely rescue, ethical medical care, and a real chance at a safe life.'],
    ['Vision', 'A compassionate India where animals and people coexist with less fear, less conflict, and more responsibility.'],
    ['Promise', 'Every contribution is treated as trust. We focus it on food, medicines, rehabilitation, adoption, and awareness.'],
];

const impactNumbers = [
    ['65K+', 'lives touched'],
    ['1L+', 'animals rescued'],
    ['3,000+', 'resident animals'],
    ['500+', 'adoptions completed'],
];

const milestones = [
    ['Lockdown feeding', 'A daily feeding drive exposed how many animals needed more than food.'],
    ['Medical response', 'Rescue calls turned into treatment plans, recovery routines, and veterinary partnerships.'],
    ['Community model', 'Volunteers, donors, schools, and adopters now move the mission forward together.'],
];

const About = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'About Pyaar Foundation';
    }, []);

    return (
        <div className="bg-mist text-slate-900">
            <section className="relative overflow-hidden bg-clay px-6 py-28 text-white lg:px-12">
                <div className="absolute inset-0 opacity-30">
                    <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1600&q=80" alt="" className="h-full w-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-clay via-clay/90 to-clay/45" />
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative mx-auto max-w-7xl">
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-linen">About Pyaar Foundation</p>
                    <h1 className="mt-5 max-w-4xl text-5xl font-black leading-tight tracking-tight sm:text-6xl">Built for animals who cannot wait for kindness.</h1>
                    <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200">Pyaar Foundation began with emergency feeding and grew into a rescue, rehabilitation, adoption, and awareness movement for animals in distress.</p>
                </motion.div>
            </section>

            <section className="mx-auto grid max-w-7xl gap-6 px-6 py-20 lg:grid-cols-3 lg:px-12">
                {pillars.map(([title, text], index) => (
                    <motion.article key={title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="rounded-[2rem] border border-white bg-white p-8 shadow-xl shadow-slate-200/60">
                        <FaShieldAlt className="text-3xl text-primary" />
                        <h2 className="mt-6 text-3xl font-black">{title}</h2>
                        <p className="mt-4 leading-7 text-slate-600">{text}</p>
                    </motion.article>
                ))}
            </section>

            <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-12">
                <div className="grid gap-5 rounded-[2rem] border border-white bg-white p-5 shadow-xl shadow-slate-200/50 md:grid-cols-4">
                    {impactNumbers.map(([value, label]) => (
                        <div key={label} className="rounded-3xl bg-mist p-6 text-center">
                            <p className="text-4xl font-black text-primary">{value}</p>
                            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 lg:grid-cols-2 lg:px-12">
                <div className="grid grid-cols-2 gap-4">
                    <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=700&q=80" alt="Rescued animal care" loading="lazy" className="h-72 w-full rounded-[2rem] object-cover shadow-xl" />
                    <img src="https://images.unsplash.com/photo-1601758175576-648226072e90?auto=format&fit=crop&w=700&q=80" alt="Animal welfare volunteer" loading="lazy" className="mt-10 h-72 w-full rounded-[2rem] object-cover shadow-xl" />
                </div>
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">Our story</p>
                    <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">The gap was visible. So we decided to build the bridge.</h2>
                    <div className="mt-7 space-y-5 text-lg leading-8 text-slate-600">
                        <p>Feeding animals during the lockdown showed us an uncomfortable truth: many street animals were not only hungry, they were injured, infected, abandoned, and invisible.</p>
                        <p>Pyaar Foundation exists to make sure help reaches those animals faster. Our work combines rescue response, veterinary treatment, rehabilitation, adoption support, sterilisation, vaccination, and education.</p>
                        <p className="rounded-2xl border-l-4 border-primary bg-white p-5 font-semibold text-slate-900 shadow-sm">Compassion becomes meaningful when it turns into transport, treatment, medicine, food, shelter, and a second chance.</p>
                    </div>
                </div>
            </section>

            <section className="bg-white px-6 py-24 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-12 max-w-3xl">
                        <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">How we grew</p>
                        <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">A practical model of care, not just a feeling.</h2>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {milestones.map(([title, text], index) => (
                            <div key={title} className="rounded-[2rem] bg-mist p-8">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl font-black text-primary shadow-sm">{index + 1}</div>
                                <h3 className="mt-6 text-2xl font-black">{title}</h3>
                                <p className="mt-4 leading-7 text-slate-600">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-clay px-6 py-24 text-white lg:px-12">
                <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.75fr_1.25fr]">
                    <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 backdrop-blur">
                        <FaQuoteLeft className="text-4xl text-linen" />
                        <p className="mt-8 text-3xl font-black leading-snug">Compassion without action is only sentiment.</p>
                        <p className="mt-6 text-slate-300">This belief shapes every rescue call, every dressing change, every adoption conversation, and every donation acknowledgement.</p>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-3">
                        {[
                            [FaStethoscope, 'Clinical care', 'Treatment-led decisions for animals in recovery.'],
                            [FaUsers, 'Volunteer energy', 'People-powered rescue, adoption, and awareness work.'],
                            [FaHandHoldingHeart, 'Donor trust', 'UPI QR donations recorded with clear confirmation details.'],
                        ].map(([Icon, title, text]) => (
                            <div key={title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-6">
                                <Icon className="text-3xl text-honey" />
                                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                                <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <DynamicContentRenderer
                page="About"
                title="More About Our Mission"
                subtitle="Stories, updates, and details added from the admin panel appear here automatically."
            />

            <section className="px-6 py-24 text-center lg:px-12">
                <h2 className="text-4xl font-black tracking-tight text-slate-950">Be part of the next rescue story.</h2>
                <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">Donate, volunteer, adopt, foster, report a case, or help us teach compassion before cruelty begins.</p>
                <button onClick={() => navigate('/donate')} className="btn-primary mt-8 px-9 py-4">Support Our Mission <FaArrowRight /></button>
            </section>
        </div>
    );
};

export default About;
