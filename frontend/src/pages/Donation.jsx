import React, { useEffect, useState } from 'react';
import { FaBuilding, FaGlobeAmericas, FaShieldAlt, FaShareAlt, FaUniversity } from 'react-icons/fa';
import api from '../utils/api';

const ORGANIZATION_NAME = 'PETANITY AND ANIMAL REHABILITATORS FOUNDATION';
const UPI_ID = 'petanityandanimalreh.97108903@hdfcbank';
const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=420x420&data=${encodeURIComponent(`upi://pay?pa=${UPI_ID}&pn=${ORGANIZATION_NAME}&cu=INR`)}`;
const WHATSAPP_NUMBER = '9422567030';
const WHATSAPP_MESSAGE = 'Hello, I have shared my donation receipt. Please confirm the donation for Petanity and Animal Rehabilitators Foundation.';

const indianBankDetails = [
    ['Account Name', 'Petanity and Animal Rehabilitator Foundation Chandrapur'],
    ['Account Number', '502000667558590'],
    ['Bank Name', 'HDFC Bank'],
    ['IFSC Code', 'HDFC0001053'],
    ['Phone No.', '94225 67030'],
    ['UPI ID', UPI_ID],
];

const internationalDetails = [
    ['Account Name', 'Petanity and Animal Rehabilitator Foundation Chandrapur'],
    ['FCRA Account Number', '41079582800'],
    ['Bank Name', 'State Bank of India'],
    ['FCRA Reg. Code', '08381070'],
    ['Branch Code', '00691'],
    ['SWIFT CODE', 'SBININBB104'],
    ['BRANCH', 'NEW DELHI MAIN BRANCH'],
    ['PayPal', 'paypal.me/pyaarfoundation'],
    ['Contact', 'pyaar4petanity@gmail.com'],
];

const Donation = () => {
    const [amount, setAmount] = useState('');
    const [donorName, setDonorName] = useState('');
    const [paymentError, setPaymentError] = useState('');
    const [isPaying, setIsPaying] = useState(false);

    useEffect(() => {
        document.title = 'Bank Transfer Details | Pyaar Foundation';
    }, []);

    const handleWhatsAppShare = () => {
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    };

    const handlePayment = async (event) => {
        event.preventDefault();
        setPaymentError('');
        setIsPaying(true);

        try {
            const { data } = await api.post('/api/payments/initiate', { amount, name: donorName });
            window.location.assign(data.redirectUrl);
        } catch (error) {
            setPaymentError(error.response?.data?.message || 'Unable to start payment. Please try again.');
            setIsPaying(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f5f1] px-4 py-24 text-slate-800 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl space-y-10">
                <header className="mx-auto max-w-3xl text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.35em] text-primary">Pyaar Foundation</p>
                    <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">Bank Transfer Details</h1>
                    <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">You can also donate directly through bank transfer.</p>
                </header>

                <section className="rounded-[2rem] border border-emerald-200 bg-emerald-50 px-6 py-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:px-8">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200">
                            <FaShieldAlt size={18} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight text-emerald-900 sm:text-2xl">80G/12A Tax Deduction Available</h2>
                            <p className="mt-2 text-sm leading-7 text-emerald-900/80 sm:text-base">Your generous donations help support our animal welfare initiatives. Eligible donors can claim tax benefits under applicable Income Tax rules. Donation receipts and required documents will be provided for eligible contributions.</p>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-2">
                    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-8">
                        <div className="mb-6 flex items-center gap-3 text-primary">
                            <FaUniversity size={18} />
                            <h2 className="text-lg font-bold text-slate-900">Indian Bank Details</h2>
                        </div>
                        <dl className="space-y-4 text-sm sm:text-base">
                            {indianBankDetails.map(([label, value]) => (
                                <div key={label} className="grid grid-cols-[130px_1fr] gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0 sm:grid-cols-[160px_1fr]">
                                    <dt className="font-semibold text-slate-600">{label}</dt>
                                    <dd className="break-words text-slate-800">{value}</dd>
                                </div>
                            ))}
                        </dl>
                    </article>

                    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-8">
                        <div className="mb-6 flex items-center gap-3 text-primary">
                            <FaGlobeAmericas size={18} />
                            <h2 className="text-lg font-bold text-slate-900">International Donors</h2>
                        </div>
                        <dl className="space-y-4 text-sm sm:text-base">
                            {internationalDetails.map(([label, value]) => (
                                <div key={label} className="grid grid-cols-[130px_1fr] gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0 sm:grid-cols-[160px_1fr]">
                                    <dt className="font-semibold text-slate-600">{label}</dt>
                                    <dd className="break-words text-slate-800">{value}</dd>
                                </div>
                            ))}
                        </dl>
                        <p className="mt-6 text-sm leading-6 text-slate-500">International donors can use PayPal or SWIFT transfer for contributions.</p>
                    </article>
                </section>

                <section className="rounded-[2rem] border border-slate-200 bg-white px-6 py-10 text-center shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:px-10">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">Donate Online</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">Enter your details to continue securely to the payment gateway.</p>
                    <form onSubmit={handlePayment} className="mx-auto mt-8 grid max-w-2xl gap-4 text-left sm:grid-cols-[1fr_1.4fr_auto] sm:items-end">
                        <label className="text-sm font-semibold text-slate-700">
                            Amount (INR)
                            <input type="number" min="1" step="0.01" required value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="500" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
                        </label>
                        <label className="text-sm font-semibold text-slate-700">
                            Your name
                            <input type="text" minLength="2" maxLength="100" required value={donorName} onChange={(event) => setDonorName(event.target.value)} placeholder="Enter your name" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
                        </label>
                        <button type="submit" disabled={isPaying} className="inline-flex min-h-[50px] items-center justify-center rounded-xl bg-primary px-7 py-3 font-bold text-white transition hover:brightness-95 disabled:cursor-wait disabled:opacity-60">
                            {isPaying ? 'Opening...' : 'Pay'}
                        </button>
                    </form>
                    {paymentError && <p className="mt-4 text-sm font-semibold text-red-600" role="alert">{paymentError}</p>}
                </section>

                <section className="rounded-[2rem] border border-slate-200 bg-white px-6 py-10 text-center shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:px-10">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">Scan to Donate</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">Use any UPI app to scan the QR code and make a payment.</p>
                    <div className="mt-8 flex justify-center">
                        <div className="rounded-[1.75rem] border border-slate-100 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.12)]">
                            <img src={QR_CODE_URL} alt="Donation QR code" className="h-auto w-52 sm:w-64" />
                        </div>
                    </div>
                    <p className="mt-6 break-words text-xs font-medium text-slate-500 sm:text-sm">UPI ID: {UPI_ID}</p>
                </section>

                <section className="rounded-[2rem] border border-slate-200 bg-white px-6 py-10 text-center shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:px-10">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">Share Your Receipt</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">After donating, please share your payment receipt with us on WhatsApp for confirmation.</p>
                    <button
                        type="button"
                        onClick={handleWhatsAppShare}
                        className="mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-[#25d366] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/20 transition hover:bg-[#1fb85a] sm:px-8 sm:py-4 sm:text-base"
                    >
                        <FaShareAlt /> Share on WhatsApp
                    </button>
                </section>

                <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-8">
                        <div className="mb-4 flex items-center gap-3 text-primary">
                            <FaBuilding size={18} />
                            <h2 className="text-lg font-bold text-slate-900">Donation Address</h2>
                        </div>
                        <address className="not-italic space-y-2 text-sm leading-7 text-slate-600 sm:text-base">
                            <p>C/O Dr. Devendra Rapelli</p>
                            <p>Pyaar Foundation</p>
                            <p>Petanity And Animal Rehabilitators Foundation Chandrapur.</p>
                            <p>Animal welfare organisation</p>
                            <p>Near pipeline, vichoda bujruk</p>
                            <p>Chandrapur Maharashtra</p>
                            <p>442406.</p>
                        </address>
                    </article>

                    <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
                        <iframe
                            title="Pyaar Foundation location map"
                            src="https://www.google.com/maps?q=Devend+R,+2763%2BX7+PYAAR+FOUNDATION,+Pyaar+foundation,+C%2Fo,+near+pipeline,+Vichoda,+Chota+Nagpur,+Maharashtra+442404&output=embed"
                            className="h-[320px] w-full border-0 grayscale transition duration-500 hover:grayscale-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                        />
                        <div className="border-t border-slate-100 p-5 text-center">
                            <a
                                href="https://www.google.com/maps/place/Devend+R,+2763%2BX7+PYAAR+FOUNDATION,+Pyaar+foundation,+C%2Fo,+near+pipeline,+Vichoda,+Chota+Nagpur,+Maharashtra+442404/data=!4m2!3m1!1s0x3bd3290025ea1737:0x5a5e6394e25cbb92?utm_source=mstt_1&entry=gps&coh=192189&g_ep=CAESBzI1LjI2LjQYACCenQoqhwEsOTQyNzUzMDYsOTQyMjMyOTksOTQyMTY0MTMsOTQyODA1NzYsOTQyMTI0OTYsOTQyMDczOTQsOTQyMDc1MDYsOTQyMDg1MDYsOTQyMTc1MjMsOTQyMTg2NTMsOTQyMjk4MzksOTQyNzUxNjgsNDcwODQzOTMsOTQyMTMyMDAsOTQyNTgzMjVCAklO&skid=f7d88dac-b7ae-4d5b-acaa-e86364f05535&g_st=aw"
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm font-bold text-primary transition hover:text-slate-900"
                            >
                                Open in Google Maps
                            </a>
                        </div>
                    </article>
                </section>
            </div>
        </div>
    );
};

export default Donation;
