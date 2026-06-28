import React, { useState } from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import api from '../utils/api';
import PhoneAction from '../components/PhoneAction';

const MAPS_LINK = 'https://www.google.com/maps/place/Devend+R,+2763%2BX7+PYAAR+FOUNDATION,+Pyaar+foundation,+C%2Fo,+near+pipeline,+Vichoda,+Chota+Nagpur,+Maharashtra+442404/data=!4m2!3m1!1s0x3bd3290025ea1737:0x5a5e6394e25cbb92?utm_source=mstt_1&entry=gps&coh=192189&g_ep=CAESBzI1LjI2LjQYACCenQoqhwEsOTQyNzUzMDYsOTQyMjMyOTksOTQyMTY0MTMsOTQyODA1NzYsOTQyMTI0OTYsOTQyMDczOTQsOTQyMDc1MDYsOTQyMDg1MDYsOTQyMTc1MjMsOTQyMTg2NTMsOTQyMjk4MzksOTQyNzUxNjgsNDcwODQzOTMsOTQyMTMyMDAsOTQyNTgzMjVCAklO&skid=f7d88dac-b7ae-4d5b-acaa-e86364f05535&g_st=aw';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    React.useEffect(() => {
        document.title = 'Contact | Pyaar Foundation';
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        setErrorMessage('');

        try {
            await api.post('/api/feedback', {
                name: formData.name,
                email: formData.email,
                feedback: formData.message,
            });

            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Contact form error:', error);
            setStatus('error');
            setErrorMessage(error.response?.data?.message || 'Unable to send your message. Please try again later.');
        }
    };

    return (
        <div className="page-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                <div className="space-y-10">
                    <div>
                        <p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-primary">Contact Pyaar Foundation</p>
                        <h1 className="section-title mb-4">Get in touch</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-md">
                            We'd love to hear from you. Whether you have a question about our rescues, volunteering, or donations, our team is ready to answer all your questions.
                        </p>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <FaMapMarkerAlt size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">Our Location</h4>
                                <p className="text-gray-500 dark:text-gray-400 mt-1 leading-7">
                                    C/O Dr. Devendra Rapelli<br />
                                    PYAAR FOUNDATION<br />
                                    Petanity And Animal Rehabilitators Foundation Chandrapur.<br />
                                    Animal welfare organisation<br />
                                    Near pipeline, vichoda bujruk<br />
                                    Chandrapur Maharashtra 442406.
                                </p>
                                <a href={MAPS_LINK} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-semibold text-primary hover:text-clay">
                                    Open in Google Maps
                                </a>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <FaEnvelope size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">Email Us</h4>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">contact@risefortails.org</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <FaPhoneAlt size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">Call Us</h4>
                                <div className="mt-1 text-gray-500 dark:text-gray-400">
                                    <PhoneAction number="+91 94225 67030" />
                                    <div className="mt-2"><PhoneAction number="+91 75888 93939" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-darkCard p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <iframe
                            src="https://www.google.com/maps?q=Devend+R,+2763%2BX7+PYAAR+FOUNDATION,+Pyaar+foundation,+C%2Fo,+near+pipeline,+Vichoda,+Chota+Nagpur,+Maharashtra+442404&output=embed"
                            width="100%"
                            height="300"
                            className="rounded-xl border-0 grayscale hover:grayscale-0 transition-all duration-500"
                            allowFullScreen
                            loading="lazy"
                            title="Location Map"
                        ></iframe>
                    </div>
                </div>
                <div className="card lg:sticky lg:top-28">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a message</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                            <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input-field" placeholder="John Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email address</label>
                            <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="input-field" placeholder="john@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                            <textarea required rows="5" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="input-field resize-none" placeholder="How can we help you?"></textarea>
                        </div>
                        <button type="submit" className="btn-primary w-full" disabled={status === 'sending'}>
                            {status === 'sending' ? 'Sending...' : 'Send Message'}
                        </button>
                        {status === 'success' && (<p className="text-primary font-medium text-center bg-primary/10 p-3 rounded-lg mt-4">Message sent successfully!</p>)}
                        {status === 'error' && (<p className="text-red-500 font-medium text-center bg-red-50 p-3 rounded-lg mt-4">{errorMessage || 'Error sending message. Please try again.'}</p>)}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
