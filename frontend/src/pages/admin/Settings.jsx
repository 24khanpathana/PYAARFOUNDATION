import React, { useState, useEffect } from 'react';
import './Settings.css';

const Settings = ({ api }) => {
    const [settings, setSettings] = useState({ otpEmails: [], isOtpEnabled: true });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [newEmail, setNewEmail] = useState('');
    const [animals, setAnimals] = useState([]);
    const [animalForm, setAnimalForm] = useState({ name: '', tag: '', age: '', breed: '', healthStatus: '', story: '', imageUrl: '' });
    const [editingAnimal, setEditingAnimal] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [settingsRes, animalsRes] = await Promise.all([api.get('/api/settings'), api.get('/api/animals')]);
                setSettings(settingsRes.data);
                setAnimals(animalsRes.data);
            } catch (err) {
                console.error("Failed to fetch settings data", err);
            }
        };
        fetchData();
    }, [api]);

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    };

    // --- Settings Logic ---
    const handleSettingChange = async (e) => {
        const { name, value, type, checked } = e.target;
        const newSettings = { ...settings, [name]: type === 'checkbox' ? checked : value };
        setSettings(newSettings);
        try {
            await api.put('/api/settings', newSettings);
            showMessage('Settings updated successfully!');
        } catch (err) {
            showMessage('Failed to update settings.', 'error');
        }
    };
    
    const handleAddEmail = async () => {
        if (!newEmail || settings.otpEmails.includes(newEmail)) return;
        const newEmails = [...settings.otpEmails, newEmail];
        try {
            await api.put('/api/settings', { ...settings, otpEmails: newEmails });
            setSettings({...settings, otpEmails: newEmails});
            setNewEmail('');
            showMessage('Email added successfully!');
        } catch (err) { showMessage('Failed to add email.', 'error'); }
    };
    
    const handleRemoveEmail = async (emailToRemove) => {
        const newEmails = settings.otpEmails.filter(email => email !== emailToRemove);
        try {
            await api.put('/api/settings', { ...settings, otpEmails: newEmails });
            setSettings({...settings, otpEmails: newEmails});
            showMessage('Email removed successfully!');
        } catch (err) { showMessage('Failed to remove email.', 'error'); }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return showMessage("New passwords don't match.", 'error');
        }
        try {
            const { data } = await api.post('/api/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            showMessage(data.message);
        } catch (err) {
            showMessage(err.response?.data?.message || 'Failed to change password.', 'error');
        }
    };

    // --- Animal Management Logic ---
    const handleAnimalFormChange = e => setAnimalForm({...animalForm, [e.target.name]: e.target.value});
    
    const handleAnimalSubmit = async (e) => {
        e.preventDefault();
        try {
            if(editingAnimal) {
                // Update
                const {data: updatedAnimal} = await api.put(`/api/animals/${editingAnimal._id}`, animalForm);
                setAnimals(animals.map(a => a._id === updatedAnimal._id ? updatedAnimal : a));
                showMessage('Animal updated successfully!');
            } else {
                // Create
                const {data: newAnimal} = await api.post('/api/animals', animalForm);
                setAnimals([newAnimal, ...animals]);
                showMessage('Animal added successfully!');
            }
            setEditingAnimal(null);
            setAnimalForm({ name: '', tag: '', age: '', breed: '', healthStatus: '', story: '', imageUrl: '' });
        } catch (err) {
            showMessage('Failed to save animal.', 'error');
        }
    };

    const handleEditAnimal = (animal) => {
        setEditingAnimal(animal);
        setAnimalForm(animal);
        window.scrollTo(0, document.body.scrollHeight); // scroll to form
    };

    const handleDeleteAnimal = async (id) => {
        if (window.confirm('Are you sure you want to delete this listing?')) {
            try {
                await api.delete(`/api/animals/${id}`);
                setAnimals(animals.filter(a => a._id !== id));
                showMessage('Animal deleted successfully!');
            } catch (err) {
                showMessage('Failed to delete animal.', 'error');
            }
        }
    };

    return (
        <div className="settings-container">
            {message.text && <div className={`message ${message.type}`}>{message.text}</div>}
            
            {/* Security Settings */}
            <div className="settings-section">
                <h3>Security Settings</h3>
                <div className="form-group checkbox-group">
                    <input type="checkbox" id="isOtpEnabled" name="isOtpEnabled" checked={settings.isOtpEnabled} onChange={handleSettingChange} />
                    <label htmlFor="isOtpEnabled">Enable OTP Login</label>
                </div>

                <div className="form-group">
                    <label>OTP Recipient Emails</label>
                    <ul className="email-list">
                        {settings.otpEmails.map(email => (
                            <li key={email}>{email} <button onClick={() => handleRemoveEmail(email)}>&times;</button></li>
                        ))}
                    </ul>
                    <div className="add-email-group">
                        <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="new-email@example.com" className="form-control" />
                        <button onClick={handleAddEmail} className="button-primary">Add</button>
                    </div>
                </div>

                <form onSubmit={handlePasswordChange}>
                    <label>Change Admin Password</label>
                    <input type="password" placeholder="Current Password" value={passwordData.currentPassword} onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} className="form-control" required/>
                    <input type="password" placeholder="New Password" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} className="form-control" required/>
                    <input type="password" placeholder="Confirm New Password" value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="form-control" required/>
                    <button type="submit" className="button-primary">Update Password</button>
                </form>
            </div>
            
            {/* Adoption Management */}
            <div className="settings-section">
                <h3>Manage Adoption Listings</h3>
                <div className="animal-list">
                    {animals.map(animal => (
                        <div key={animal._id} className="animal-list-item card-theme">
                            <img src={animal.imageUrl} alt={animal.name} />
                            <span>{animal.name} - {animal.tag}</span>
                            <div>
                                <button onClick={() => handleEditAnimal(animal)}>Edit</button>
                                <button onClick={() => handleDeleteAnimal(animal._id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleAnimalSubmit} className="animal-form">
                    <h4>{editingAnimal ? 'Edit Animal' : 'Add New Animal'}</h4>
                    <input name="name" value={animalForm.name} onChange={handleAnimalFormChange} placeholder="Name" required className="form-control" />
                    <input name="tag" value={animalForm.tag} onChange={handleAnimalFormChange} placeholder="Tag (e.g., Dog, Cat)" required className="form-control" />
                    <input name="age" value={animalForm.age} onChange={handleAnimalFormChange} placeholder="Age" required className="form-control" />
                    <input name="breed" value={animalForm.breed} onChange={handleAnimalFormChange} placeholder="Breed" required className="form-control" />
                    <input name="healthStatus" value={animalForm.healthStatus} onChange={handleAnimalFormChange} placeholder="Health Status" required className="form-control" />
                    <input name="imageUrl" value={animalForm.imageUrl} onChange={handleAnimalFormChange} placeholder="Image URL" required className="form-control" />
                    <textarea name="story" value={animalForm.story} onChange={handleAnimalFormChange} placeholder="Rescue Story" required className="form-control"></textarea>
                    <button type="submit" className="button-primary">{editingAnimal ? 'Update Animal' : 'Add Animal'}</button>
                    {editingAnimal && <button type="button" onClick={() => { setEditingAnimal(null); setAnimalForm({ name: '', tag: '', age: '', breed: '', healthStatus: '', story: '', imageUrl: '' }); }}>Cancel Edit</button>}
                </form>
            </div>
        </div>
    );
};

export default Settings;