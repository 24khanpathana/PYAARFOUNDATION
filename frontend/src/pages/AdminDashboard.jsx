import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../utils/api';

const AdminDashboard = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const[activeTab, setActiveTab] = useState('adoption'); 
    
    const [contents, setContents] = useState([]);
    const [animals, setAnimals] = useState([]);
    const [sponsors, setSponsors] = useState([]);
    const [auditRequests, setAuditRequests] = useState([]);
    const [overviewData, setOverviewData] = useState({ volunteers: [], feedback: [], complaints: [] });
    const [auditSearch, setAuditSearch] = useState('');
    const [csvDownloading, setCsvDownloading] = useState(false);
    
    const [selectedPage, setSelectedPage] = useState('Home');
    const legacyDonationPageName = ['Donation', 'Schema'].join(' ');
    const donationPageNames = ['Donation Schemes', legacyDonationPageName];
    const isDonationPage = (page) => donationPageNames.includes(page);
    const emptyContentForm = { title: '', description: '', amount: '', imageUrl: '', date: '', role: '' };
    const [formData, setFormData] = useState(emptyContentForm);
    const [editingId, setEditingId] = useState(null);
    const [customFields, setCustomFields] = useState([]);
    const [addCustomForm, setAddCustomForm] = useState(false);

    const [animalData, setAnimalData] = useState({ name: '', age: '', breed: '', description: '', imageUrl: '' });
    const [editingAnimalId, setEditingAnimalId] = useState(null);
    const [sponsorData, setSponsorData] = useState({ name: '', imageUrl: '', description: '', organization: '', contact: '', link: '' });
    const [editingSponsorId, setEditingSponsorId] = useState(null);

    // Ensure API instance doesn't recreate on every render to prevent infinite loops in useEffect
    const api = React.useMemo(() => axios.create({ 
        baseURL: API_BASE_URL, 
        headers: { Authorization: `Bearer ${token}` } 
    }), [token]);

    const fetchAllData = useCallback(async () => {
        try {
            const[contentRes, animalRes, sponsorRes, volRes, feedRes, compRes, auditRes] = await Promise.all([
                api.get('/api/content'), api.get('/api/animals'), api.get('/api/sponsors'), api.get('/api/volunteers'), api.get('/api/feedback'), api.get('/api/complaints'), api.get('/api/audit-requests')
            ]);
            setContents(contentRes.data); setAnimals(animalRes.data); setSponsors(sponsorRes.data);
            setOverviewData({ volunteers: volRes.data, feedback: feedRes.data, complaints: compRes.data });
            setAuditRequests(auditRes.data);
        } catch (error) { if (error.response?.status === 401) { logout(); navigate('/'); } }
    }, [api, logout, navigate]);

    useEffect(() => { fetchAllData(); }, [fetchAllData]);

    const handleLogout = () => { logout(); navigate('/'); };

    const handleDownloadCsv = async () => {
        try {
            setCsvDownloading(true);
            const response = await api.get('/api/admin/export-csv', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv;charset=utf-8;' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'admin-export.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert('Failed to download CSV. Please try again.');
        } finally {
            setCsvDownloading(false);
        }
    };

     // ==========================================
    // INSTANT DELETE LOGIC (NO PAGE RELOAD)
    // ==========================================
    const handleGenericDelete = async (endpoint, id, stateKey) => {
        if(window.confirm('Are you sure you want to permanently delete this record?')) {
            try {
                const response = await api.delete(`${endpoint}/${id}`);
                
                if (response.status === 200) {
                    alert('Record deleted successfully');
                    
                    if (stateKey) {
                        setOverviewData(prevData => ({
                            ...prevData,
                            [stateKey]: prevData[stateKey].filter(item => item._id !== id)
                        }));
                    } else {
                        fetchAllData();
                    }
                }
            } catch (error) { 
                alert('Failed to delete record. Please try again.'); 
                console.error(error);
            }
        }
    };

    // --- Content Handlers ---
    const resetContentForm = () => {
        setFormData(emptyContentForm);
        setCustomFields([]);
        setAddCustomForm(false);
        setEditingId(null);
    };

    const handleContentPageChange = (page) => {
        setSelectedPage(page);
        resetContentForm();
    };

    const handleContentSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...formData, page: selectedPage };

        if (!payload.date) {
            delete payload.date;
        }

        if (!isDonationPage(selectedPage)) {
            payload.amount = '';
        }

        if (selectedPage === 'Service' && addCustomForm) {
            const sanitizedFields = customFields
                .map(field => ({ name: field.name?.trim(), type: field.type || 'text' }))
                .filter(field => field.name);

            if (sanitizedFields.length > 0) {
                payload.customForm = { title: formData.title.trim(), fields: sanitizedFields };
            }
        } else {
            payload.customForm = undefined;
        }

        try {
            if (editingId) await api.put(`/api/content/${editingId}`, payload);
            else await api.post('/api/content', payload);

            resetContentForm();
            fetchAllData();
        } catch (error) {
            console.error(error);
            const message = error.code === 'ERR_NETWORK'
                ? 'Backend server is not running. Start the backend on http://localhost:5000 and try again.'
                : error.response?.data?.message || error.message || 'Error saving content';
            alert(message);
        }
    };

    const handleContentDelete = async (id) => handleGenericDelete('/api/content', id);

    const editContentItem = (item) => {
        setEditingId(item._id);
        setFormData({ title: item.title || '', description: item.description || '', amount: item.amount || '', imageUrl: item.imageUrl || '', date: item.date ? item.date.split('T')[0] : '', role: item.role || '' });
        if(item.customForm?.fields?.length) {
            setAddCustomForm(true);
            setCustomFields(item.customForm.fields);
        } else {
            setAddCustomForm(false);
            setCustomFields([]);
        }
    };

    // --- Animal Handlers ---
    const handleAnimalSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAnimalId) await api.put(`/api/animals/${editingAnimalId}`, animalData);
            else await api.post('/api/animals', animalData);
            setAnimalData({ name: '', age: '', breed: '', description: '', imageUrl: '' });
            setEditingAnimalId(null);
            fetchAllData();
        } catch (error) { alert('Error saving animal'); }
    };

    const handleAnimalDelete = async (id) => handleGenericDelete('/api/animals', id);

    const editAnimal = (animal) => {
        setEditingAnimalId(animal._id);
        setAnimalData({ name: animal.name, age: animal.age, breed: animal.breed, description: animal.description, imageUrl: animal.imageUrl });
    };

    // --- Sponsor Handlers ---
    const handleSponsorSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSponsorId) await api.put(`/api/sponsors/${editingSponsorId}`, sponsorData);
            else await api.post('/api/sponsors', sponsorData);
            setSponsorData({ name: '', imageUrl: '', description: '', organization: '', contact: '', link: '' });
            setEditingSponsorId(null);
            fetchAllData();
        } catch (error) { alert('Error saving sponsor'); }
    };

    const handleSponsorDelete = async (id) => {
        if(window.confirm('Are you sure you want to permanently delete this sponsor?')) {
            try {
                await api.delete(`/api/sponsors/${id}`);
                setSponsors(prev => prev.filter(sponsor => sponsor._id !== id));
                alert('Sponsor deleted successfully');
            } catch (error) {
                alert('Failed to delete sponsor. Please try again.');
            }
        }
    };

    const editSponsor = (sponsor) => {
        setEditingSponsorId(sponsor._id);
        setSponsorData({
            name: sponsor.name || '',
            imageUrl: sponsor.imageUrl || '',
            description: sponsor.description || '',
            organization: sponsor.organization || '',
            contact: sponsor.contact || '',
            link: sponsor.link || '',
        });
    };

    // --- Dynamic Table Renderer ---
    const renderTable = (items, headers, apiEndpoint) => {
        if (!items || items.length === 0) {
            return (
                <div className="card flex flex-col items-center justify-center p-10 text-center">
                    <p className="text-xl font-medium text-gray-500 dark:text-gray-400">No data available for this section.</p>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto card !p-0">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                        <tr>
                            {Object.keys(headers).map(h => <th key={h} className="p-4 font-semibold">{h}</th>)}
                            <th className="p-4 font-semibold text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {items.map(item => (
                            <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                {Object.keys(headers).map(key => (
                                    <td key={key} className="p-4 max-w-xs truncate">
                                        {Array.isArray(item[headers[key]]) ? item[headers[key]].join(', ') : (item[headers[key]] || 'N/A')}
                                    </td>
                                ))}
                                <td className="p-4 text-center">
                                    <button onClick={() => handleGenericDelete(apiEndpoint, item._id)} className="text-red-600 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 px-3 py-1 rounded transition-colors text-sm font-semibold">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const handleAuditStatusChange = async (id, status) => {
        try {
            const { data } = await api.patch(`/api/audit-requests/${id}`, { status });
            setAuditRequests(prev => prev.map(item => (item._id === id ? data : item)));
        } catch (error) {
            alert('Failed to update request status.');
        }
    };

    const handleAuditDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete this request?')) {
            try {
                await api.delete(`/api/audit-requests/${id}`);
                setAuditRequests(prev => prev.filter(item => item._id !== id));
            } catch (error) {
                alert('Failed to delete request.');
            }
        }
    };

    const renderAuditManager = () => {
        const filteredRequests = auditRequests.filter(item => {
            const searchValue = auditSearch.trim().toLowerCase();
            if (!searchValue) return true;
            return [item.name, item.mobile, item.email, item.documentType, item.description, item.status]
                .filter(Boolean)
                .some(value => value.toLowerCase().includes(searchValue));
        });

        return (
            <div>
                <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-primary mb-2">Audit Document Requests</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Review, filter, update, or delete submitted document requests.</p>
                    </div>
                    <input
                        type="search"
                        value={auditSearch}
                        onChange={e => setAuditSearch(e.target.value)}
                        placeholder="Search requests"
                        className="input-field w-full lg:w-96"
                    />
                </div>

                {filteredRequests.length === 0 ? (
                    <div className="card p-10 text-center text-gray-500 font-medium">No audit document requests found.</div>
                ) : (
                    <div className="overflow-x-auto card !p-0">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                                <tr>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Mobile</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Document</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Requested</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredRequests.map(request => (
                                    <tr key={request._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="p-4 font-medium">{request.name}</td>
                                        <td className="p-4 text-gray-500">{request.mobile}</td>
                                        <td className="p-4 text-gray-500">{request.email}</td>
                                        <td className="p-4 text-gray-500 max-w-xs truncate">{request.documentType}</td>
                                        <td className="p-4">
                                            <select
                                                value={request.status || 'Pending'}
                                                onChange={e => handleAuditStatusChange(request._id, e.target.value)}
                                                className="input-field !py-2"
                                            >
                                                {['Pending', 'In Review', 'Approved', 'Rejected', 'Completed'].map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-4 text-gray-500">{request.createdAt ? new Date(request.createdAt).toLocaleString() : 'N/A'}</td>
                                        <td className="p-4 text-center">
                                            <button onClick={() => handleAuditDelete(request._id)} className="text-red-600 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 px-3 py-1 rounded transition-colors text-sm font-semibold">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    const renderContentManager = () => {
        const filteredContent = contents.filter(c => isDonationPage(selectedPage) ? isDonationPage(c.page) : c.page === selectedPage);

        return (
            <div>
                <h2 className="text-2xl font-bold text-primary mb-6">Content Manager</h2>
                <div className="card mb-8">
                    <label className="block text-sm font-semibold mb-2">Select Page to Manage</label>
                    <select value={selectedPage} onChange={e => handleContentPageChange(e.target.value)} className="input-field max-w-sm mb-6">
                        {['Home', 'About', 'Volunteer', 'Event', 'Service', 'Contact', 'Gallery', 'Donation Schemes'].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>

                    <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Item' : `Add New to ${selectedPage}`}</h3>
                    <form onSubmit={handleContentSubmit} className="space-y-4 border-t dark:border-gray-700 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="block mb-1 text-sm font-medium">{selectedPage === 'Volunteer' ? 'Volunteer Name' : 'Title'}</label><input type="text" className="input-field" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                            {['Home', 'About', 'Event', 'Service', 'Contact', 'Donation Schemes'].includes(selectedPage) && (<div><label className="block mb-1 text-sm font-medium">Description</label><input type="text" className="input-field" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>)}
                            {isDonationPage(selectedPage) && (<div><label className="block mb-1 text-sm font-medium">Amount</label><input type="text" className="input-field" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="e.g. Rs. 1000 or One-time" /></div>)}
                            <div><label className="block mb-1 text-sm font-medium">Image URL</label><input type="text" className="input-field" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} /></div>
                            {selectedPage === 'Event' && (<div><label className="block mb-1 text-sm font-medium">Event Date</label><input type="date" className="input-field" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>)}
                            {selectedPage === 'Volunteer' && (<div><label className="block mb-1 text-sm font-medium">Role</label><input type="text" className="input-field" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} /></div>)}
                        </div>
                        {selectedPage === 'Service' && (
                            <div className="pt-4 border-t dark:border-gray-700">
                                <label className="flex items-center space-x-2 cursor-pointer mb-4">
                                    <input
                                        type="checkbox"
                                        checked={addCustomForm}
                                        onChange={e => {
                                            setAddCustomForm(e.target.checked);
                                            if (e.target.checked && customFields.length === 0) {
                                                setCustomFields([{ name: '', type: 'text' }]);
                                            }
                                            if (!e.target.checked) {
                                                setCustomFields([]);
                                            }
                                        }}
                                        className="w-4 h-4 text-primary rounded"
                                    />
                                    <strong className="text-sm">Attach Custom Form (Max 5 Fields)</strong>
                                </label>
                                {addCustomForm && (
                                    <div className="space-y-3">
                                        {customFields.map((field, idx) => (
                                            <div key={idx} className="flex gap-4">
                                                <input placeholder="Field Name" className="input-field" required value={field.name} onChange={e => { const newF = [...customFields]; newF[idx].name = e.target.value; setCustomFields(newF); }} />
                                                <select className="input-field" value={field.type} onChange={e => { const newF = [...customFields]; newF[idx].type = e.target.value; setCustomFields(newF); }}>
                                                    <option value="text">Text</option><option value="email">Email</option><option value="number">Number</option>
                                                </select>
                                            </div>
                                        ))}
                                        {customFields.length < 5 && <button type="button" onClick={() => setCustomFields([...customFields, {name:'', type:'text'}])} className="text-primary font-bold text-sm hover:underline">+ Add Field</button>}
                                    </div>
                                )}
                            </div>
                        )}
                        <button type="submit" className="btn-primary mt-4">{editingId ? 'Update' : 'Save'} Content</button>
                    </form>
                </div>

                {filteredContent.length === 0 ? (
                    <div className="card p-10 text-center text-gray-500 font-medium">No content published for the {selectedPage} page yet.</div>
                ) : (
                    <div className="overflow-x-auto card !p-0">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                                <tr><th className="p-4">Title</th><th className="p-4">Details</th><th className="p-4 text-center">Actions</th></tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredContent.map(item => (
                                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="p-4 font-medium max-w-xs truncate">{item.title}</td>
                                        <td className="p-4 text-gray-500">{isDonationPage(selectedPage) ? (item.amount || item.description || 'N/A') : (item.role || (item.date ? new Date(item.date).toLocaleDateString() : item.description || 'N/A'))}</td>
                                        <td className="p-4 text-center space-x-3">
                                            <button onClick={() => editContentItem(item)} className="text-clay bg-primary/15 hover:bg-primary/25 dark:bg-primary/20 dark:text-linen px-3 py-1 rounded transition-colors text-sm font-semibold">Edit</button>
                                            <button onClick={() => handleContentDelete(item._id)} className="text-red-600 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded transition-colors text-sm font-semibold">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    const renderAdoptionManager = () => (
        <div>
            <h2 className="text-2xl font-bold text-primary mb-6">Adoption Animals Manager</h2>
            <div className="card mb-8">
                <h3 className="text-xl font-bold mb-4">{editingAnimalId ? 'Edit Animal' : 'Add New Animal'}</h3>
                <form onSubmit={handleAnimalSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block mb-1 text-sm font-medium">Name</label><input type="text" className="input-field" required value={animalData.name} onChange={e => setAnimalData({...animalData, name: e.target.value})} /></div>
                        <div><label className="block mb-1 text-sm font-medium">Age</label><input type="text" className="input-field" required value={animalData.age} onChange={e => setAnimalData({...animalData, age: e.target.value})} placeholder="e.g. 2 Months" /></div>
                        <div><label className="block mb-1 text-sm font-medium">Breed</label><input type="text" className="input-field" required value={animalData.breed} onChange={e => setAnimalData({...animalData, breed: e.target.value})} /></div>
                        <div><label className="block mb-1 text-sm font-medium">Image URL</label><input type="text" className="input-field" required value={animalData.imageUrl} onChange={e => setAnimalData({...animalData, imageUrl: e.target.value})} /></div>
                    </div>
                    <div><label className="block mb-1 text-sm font-medium">Description</label><textarea className="input-field" rows="3" required value={animalData.description} onChange={e => setAnimalData({...animalData, description: e.target.value})}></textarea></div>
                    <button type="submit" className="btn-primary">{editingAnimalId ? 'Update' : 'Save'} Animal</button>
                </form>
            </div>
            
            {animals.length === 0 ? (
                <div className="card p-10 text-center text-gray-500 font-medium">No animals registered for adoption yet.</div>
            ) : (
                <div className="overflow-x-auto card !p-0">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                            <tr><th className="p-4">Image</th><th className="p-4">Name</th><th className="p-4">Age/Breed</th><th className="p-4 text-center">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {animals.map(animal => (
                                <tr key={animal._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="p-4"><img src={animal.imageUrl} alt={animal.name} className="w-12 h-12 rounded object-cover" /></td>
                                    <td className="p-4 font-medium">{animal.name}</td>
                                    <td className="p-4 text-gray-500">{animal.age} / {animal.breed}</td>
                                    <td className="p-4 text-center space-x-3">
                                        <button onClick={() => editAnimal(animal)} className="text-clay bg-primary/15 hover:bg-primary/25 dark:bg-primary/20 dark:text-linen px-3 py-1 rounded transition-colors text-sm font-semibold">Edit</button>
                                        <button onClick={() => handleAnimalDelete(animal._id)} className="text-red-600 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded transition-colors text-sm font-semibold">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    const renderSponsorManager = () => (
        <div>
            <h2 className="text-2xl font-bold text-primary mb-6">Sponsor Manager</h2>
            <div className="card mb-8">
                <h3 className="text-xl font-bold mb-4">{editingSponsorId ? 'Edit Sponsor' : 'Add New Sponsor'}</h3>
                <form onSubmit={handleSponsorSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block mb-1 text-sm font-medium">Sponsor Name</label><input type="text" className="input-field" required value={sponsorData.name} onChange={e => setSponsorData({...sponsorData, name: e.target.value})} /></div>
                        <div><label className="block mb-1 text-sm font-medium">Sponsor Image</label><input type="text" className="input-field" required value={sponsorData.imageUrl} onChange={e => setSponsorData({...sponsorData, imageUrl: e.target.value})} placeholder="Image URL" /></div>
                        <div><label className="block mb-1 text-sm font-medium">Sponsor Organization</label><input type="text" className="input-field" value={sponsorData.organization} onChange={e => setSponsorData({...sponsorData, organization: e.target.value})} /></div>
                        <div><label className="block mb-1 text-sm font-medium">Sponsor Contact</label><input type="text" className="input-field" value={sponsorData.contact} onChange={e => setSponsorData({...sponsorData, contact: e.target.value})} /></div>
                        <div className="md:col-span-2"><label className="block mb-1 text-sm font-medium">Website/Social Link</label><input type="url" className="input-field" value={sponsorData.link} onChange={e => setSponsorData({...sponsorData, link: e.target.value})} placeholder="https://example.com" /></div>
                    </div>
                    <div><label className="block mb-1 text-sm font-medium">Sponsor Description</label><textarea className="input-field" rows="3" required value={sponsorData.description} onChange={e => setSponsorData({...sponsorData, description: e.target.value})}></textarea></div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button type="submit" className="btn-primary">{editingSponsorId ? 'Update Sponsor' : 'Save Sponsor'}</button>
                        {editingSponsorId && (
                            <button type="button" onClick={() => { setEditingSponsorId(null); setSponsorData({ name: '', imageUrl: '', description: '', organization: '', contact: '', link: '' }); }} className="btn-secondary">Cancel Edit</button>
                        )}
                    </div>
                </form>
            </div>

            {sponsors.length === 0 ? (
                <div className="card p-10 text-center text-gray-500 font-medium">No sponsors added yet.</div>
            ) : (
                <div className="overflow-x-auto card !p-0">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                            <tr><th className="p-4">Image</th><th className="p-4">Name</th><th className="p-4">Organization</th><th className="p-4">Contact</th><th className="p-4 text-center">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {sponsors.map(sponsor => (
                                <tr key={sponsor._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="p-4"><img src={sponsor.imageUrl} alt={sponsor.name} className="w-12 h-12 rounded object-cover" /></td>
                                    <td className="p-4 font-medium max-w-xs truncate">{sponsor.name}</td>
                                    <td className="p-4 text-gray-500">{sponsor.organization || 'N/A'}</td>
                                    <td className="p-4 text-gray-500">{sponsor.contact || 'N/A'}</td>
                                    <td className="p-4 text-center space-x-3">
                                        <button onClick={() => editSponsor(sponsor)} className="text-clay bg-primary/15 hover:bg-primary/25 dark:bg-primary/20 dark:text-linen px-3 py-1 rounded transition-colors text-sm font-semibold">Edit</button>
                                        <button onClick={() => handleSponsorDelete(sponsor._id)} className="text-red-600 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded transition-colors text-sm font-semibold">Delete Sponsor</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    const renderTabContent = () => {
        switch(activeTab) {
            case 'content': return renderContentManager();
            case 'adoption': return renderAdoptionManager();
            case 'sponsors': return renderSponsorManager();
            case 'audit': return renderAuditManager();
            case 'volunteers': return renderTable(overviewData.volunteers, { Name: 'name', Email: 'email', Mobile: 'mobile', Skills: 'skills' }, '/api/volunteers');
            case 'feedback': return renderTable(overviewData.feedback, { Name: 'name', Email: 'email', Feedback: 'feedback' }, '/api/feedback');
            case 'complaints': return renderTable(overviewData.complaints, { Name: 'name', Email: 'email', Complaint: 'complaint' }, '/api/complaints');
            default: return null;
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-[#0a0a0a]">
            <aside className="w-full md:w-64 bg-white dark:bg-darkCard border-r dark:border-gray-800 p-6 flex flex-col">
                <div className="mb-8 flex flex-col items-center text-center">
                    <img src="/footor-1.svg" alt="Pyaar Foundation logo" className="mb-3 h-16 w-16 rounded-2xl object-contain shadow-lg shadow-primary/20" />
                    <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
                </div>
                <nav className="flex flex-col space-y-2 flex-grow overflow-y-auto">
                    {['content', 'adoption', 'volunteers', 'sponsors', 'audit', 'feedback', 'complaints'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`text-left px-4 py-3 rounded-lg capitalize font-medium transition-colors ${activeTab === tab ? 'bg-primary text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                            {tab.replace('content', 'Content Manager').replace('adoption', 'Adoption Animals').replace('sponsors', 'Sponsors').replace('audit', 'Audit Document Requests')}
                        </button>
                    ))}
                </nav>
                <button onClick={handleLogout} className="mt-8 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold transition-colors shadow-md">Logout</button>
            </aside>
            <main className="flex-1 p-6 md:p-10 overflow-y-auto w-full">
                <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
                    <button onClick={handleDownloadCsv} disabled={csvDownloading} className="rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-linen dark:text-slate-950 dark:hover:bg-white">
                        {csvDownloading ? 'Downloading...' : 'Download CSV'}
                    </button>
                </div>
                {renderTabContent()}
            </main>
        </div>
    );
};
export default AdminDashboard;
