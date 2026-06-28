import axios from 'axios';

const getDefaultApiUrl = () => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return 'http://localhost:5000';
    }

    return '';
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || getDefaultApiUrl();

const api = axios.create({
    baseURL: API_BASE_URL,
});

export default api;
