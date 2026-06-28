import React, { useEffect, useRef, useState } from 'react';
import { FaCheck, FaCopy, FaPhoneAlt } from 'react-icons/fa';

const normalizePhone = (number) => number.replace(/[^\d+]/g, '').replace(/^\+\+/, '+');

const PhoneAction = ({ number, className = '', buttonClassName = '' }) => {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const wrapperRef = useRef(null);
    const phoneHref = `tel:${normalizePhone(number)}`;

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(normalizePhone(number));
        } catch (error) {
            const fallbackInput = document.createElement('input');
            fallbackInput.value = normalizePhone(number);
            document.body.appendChild(fallbackInput);
            fallbackInput.select();
            document.execCommand('copy');
            document.body.removeChild(fallbackInput);
        }

        setCopied(true);
        setOpen(false);
        window.setTimeout(() => setCopied(false), 2200);
    };

    return (
        <span ref={wrapperRef} className={`relative inline-flex flex-col ${className}`}>
            <button type="button" onClick={() => setOpen(prev => !prev)} className={`text-left font-semibold text-slate-700 transition hover:text-primary dark:text-slate-300 dark:hover:text-linen ${buttonClassName}`}>
                {number}
            </button>
            {open && (
                <span className="absolute left-0 top-full z-30 mt-2 w-48 overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 text-sm shadow-2xl shadow-slate-900/12 dark:border-slate-700 dark:bg-darkCard">
                    <a href={phoneHref} className="flex items-center gap-3 rounded-xl px-3 py-2 font-semibold text-slate-700 transition hover:bg-mist dark:text-slate-200 dark:hover:bg-slate-800">
                        <FaPhoneAlt className="text-primary" /> Call Number
                    </a>
                    <button type="button" onClick={handleCopy} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left font-semibold text-slate-700 transition hover:bg-mist dark:text-slate-200 dark:hover:bg-slate-800">
                        <FaCopy className="text-primary" /> Copy Number
                    </button>
                </span>
            )}
            {copied && (
                <span className="absolute left-0 top-full z-20 mt-2 inline-flex w-max items-center gap-2 rounded-full bg-clay px-4 py-2 text-xs font-bold text-white shadow-xl">
                    <FaCheck className="text-primary" /> Number copied successfully
                </span>
            )}
        </span>
    );
};

export default PhoneAction;
