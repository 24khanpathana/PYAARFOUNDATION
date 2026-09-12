import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { VOLUNTEER_ROLES } from '../utils/volunteerRoles';

const Team = () => {
    const [team, setTeam] = useState([]);
    const [selectedRole, setSelectedRole] = useState('All Roles');

    useEffect(() => {
        document.title = 'Volunteer Team | Pyaar Foundation';
        api.get('/api/content')
            .then(res => setTeam(res.data.filter(c => c.page === 'Volunteer' || c.page === 'Team')))
            .catch(() => setTeam([]));
    }, []);

    const customRoles = [...new Set(team.map(member => member.role?.trim()).filter(role => role && !VOLUNTEER_ROLES.includes(role)))];
    const availableRoles = [...VOLUNTEER_ROLES.filter(role => role !== 'Other'), ...customRoles];
    const filteredTeam = selectedRole === 'All Roles'
        ? team
        : team.filter(member => member.role?.trim() === selectedRole);

    return (
        <div className="min-h-screen w-full bg-mist pb-20 font-sans text-slate-800">
            <div className="mb-16 bg-clay px-4 py-16 text-center text-white md:py-24">
                <span className="mb-4 inline-block text-sm font-bold uppercase tracking-[0.3em] text-linen">Volunteer community</span>
                <h1 className="mb-4 text-4xl font-black md:text-6xl">Meet Our Volunteers</h1>
                <p className="mx-auto max-w-2xl text-lg text-slate-300 md:text-xl">The dedicated people behind Pyaar Foundation, from rescue response to adoption coordination.</p>
            </div>
            <div className="mx-auto max-w-7xl px-6">
                <div className="mb-10 flex flex-col gap-2 sm:max-w-xs">
                    <label htmlFor="volunteer-role" className="text-sm font-bold text-slate-700">Filter by Role</label>
                    <select id="volunteer-role" value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="input-field w-full">
                        <option value="All Roles">All Roles</option>
                        {availableRoles.map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {filteredTeam.map(member => (
                        <div key={member._id} className="flex flex-col items-center rounded-[2rem] border border-white bg-white p-8 text-center shadow-xl shadow-slate-200/50 transition duration-300 hover:-translate-y-2">
                            <img src={member.imageUrl || '/logo.svg'} alt={member.title} className="mb-6 h-40 w-40 rounded-full border-4 border-primary/20 object-cover shadow-md" />
                            <h3 className="mb-1 text-2xl font-black text-slate-950">{member.title}</h3>
                            <p className="mb-4 font-bold text-honey">{member.role}</p>
                            <p className="text-sm leading-7 text-slate-600">{member.description}</p>
                        </div>
                    ))}
                </div>
                {filteredTeam.length === 0 && (
                    <div className="mx-auto max-w-2xl rounded-[2rem] border border-white bg-white p-10 text-center shadow-xl shadow-slate-200/50">
                        <h2 className="text-2xl font-black text-slate-950">Volunteer profiles are coming soon.</h2>
                        <p className="mt-3 text-slate-600">You can still apply through the Programs page and join the Pyaar Foundation rescue network.</p>
                        <Link to="/service" className="btn-primary mt-6">Apply to Volunteer</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Team;
