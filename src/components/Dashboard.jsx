import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SearchBar from './SearchBar';
import DataTable from './DataTable';
import AddEntryForm from './AddEntryForm';
import UserForm from './UserForm';
import UserTable from './UserTable';

const API_URL = 'https://script.google.com/macros/s/AKfycbxU2-SWZ_i7TfjTbbeaLjTKBLGWgSftiV_iWyDl5-Jc4pkO-RSU4GRCH6SNQHtKkVpU/exec';

function Dashboard({ onLogout }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('sessionToken');
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');
        return token && username && role ? { token, username, role } : null;
    });

    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (!user) return navigate('/login');

        fetch(API_URL)
            .then(res => res.json())
            .then(setData);

        if (user.role === 'superadmin') fetchUsers();
    }, [user, navigate]);

    const fetchUsers = () => {
        fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'listUsers' }),
        })
            .then(res => res.json())
            .then(setUsers)
            .catch(console.error);
    };

    const handleLogout = () => {
        fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'logout' }),
        })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    localStorage.clear();
                    onLogout();
                } else {
                    alert("Logout failed: " + response.message);
                }
            })
            .catch(() => alert("Something went wrong during logout."));
    };

    if (!user) return null;

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
            <button onClick={handleLogout} className="mb-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Logout
            </button>

            <h2 className="text-2xl font-bold mb-6">
                Welcome, {user.username} <span className="text-gray-500">({user.role})</span>
            </h2>

            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <DataTable data={data} searchTerm={searchTerm} user={user} apiUrl={API_URL} />

            {(user.role === 'staff' || user.role === 'superadmin') && (
                <AddEntryForm dataHeaders={data[0] ? Object.keys(data[0]) : []} apiUrl={API_URL} />
            )}

            {user.role === 'superadmin' && (
                <>
                    <UserForm apiUrl={API_URL} username={user.username} />
                    <UserTable users={users} setUsers={setUsers} apiUrl={API_URL} />
                </>
            )}
        </div>
    );
}

export default Dashboard;
