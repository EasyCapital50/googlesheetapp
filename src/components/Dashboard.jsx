import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import DataTable from './DataTable';
import AddEntryForm from './AddEntryForm';
import UserForm from './UserForm';
import UserTable from './UserTable';

const API_URL = 'https://api.easycapitalsolution.com'; // Update with your actual API URL

function Dashboard({ onLogout }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('sessionToken');
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');
        return token && username && role ? { token, username, role } : null;
    });

    const [data, setData] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState({ records: true, users: true });
    const [error, setError] = useState({ records: null, users: null });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchRecords = async () => {
            try {
                const response = await fetch(`${API_URL}/records/get`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(response.status === 401 ? 'Session expired. Please login again.' : 'Failed to fetch records');
                }

                const json = await response.json();
                setData(Array.isArray(json) ? json : json.data || []);
            } catch (err) {
                console.error("Records fetch error:", err);
                setError(prev => ({ ...prev, records: err.message }));
                if (err.message.includes('401') || err.message.includes('expired')) {
                    handleForceLogout();
                }
            } finally {
                setLoading(prev => ({ ...prev, records: false }));
            }
        };

        fetchRecords();

        if (user.role === 'superadmin') {
            fetchUsers();
        }
    }, [user, navigate]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/users/get`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(response.status === 401 ? 'Session expired. Please login again.' : 'Failed to fetch users');
            }

            const json = await response.json();
            setUsers(Array.isArray(json) ? json : []);
        } catch (err) {
            console.error("Users fetch error:", err);
            setError(prev => ({ ...prev, users: err.message }));
            if (err.message.includes('401') || err.message.includes('expired')) {
                handleForceLogout();
            }
        } finally {
            setLoading(prev => ({ ...prev, users: false }));
        }
    };

    const refreshData = () => {
        fetch(`${API_URL}/records/get`, {
            headers: { Authorization: `Bearer ${user.token}` },
        })
            .then(res => res.json())
            .then(json => {
                if (Array.isArray(json)) {
                    setData(json);
                } else if (Array.isArray(json.data)) {
                    setData(json.data);
                }
            });
    };


    const handleForceLogout = () => {
        localStorage.clear();
        onLogout();
        navigate('/login');
    };

    const handleLogout = async () => {
        try {
            const response = await fetch(`${API_URL}/users/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.message || 'Logout failed');
            }

            localStorage.clear();
            onLogout();
            navigate('/login');
        } catch (err) {
            console.error("Logout error:", err);
            alert(err.message);
        }
    };

    if (!user) return null;

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6 lg:p-10 overflow-x-hidden">
            <div className="max-w-7xl mx-auto flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Welcome, {user.username} <span className="text-gray-500 text-lg">({user.role})</span>
                    </h2>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors w-full sm:w-auto"
                    >
                        Logout
                    </button>
                </div>

                {error.records && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                        {error.records}
                    </div>
                )}

                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                {loading.records ? (
                    <div className="text-center py-8 text-gray-600">Loading records...</div>
                ) : (
                    <DataTable
                        data={data}
                        searchTerm={searchTerm}
                        user={user}
                        apiUrl={`${API_URL}/records`}
                        token={user.token}
                        onDeleteSuccess={refreshData}
                        onEditSuccess={refreshData}
                    />


                )}

                {(user.role === 'staff' || user.role === 'superadmin') && (
                    <AddEntryForm
                        dataHeaders={data[0] ? Object.keys(data[0]) : []}
                        apiUrl={API_URL}
                        token={user.token}
                        onSuccess={() => {
                            fetch(`${API_URL}/records/get`, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${user.token}`,
                                },
                            })
                                .then(res => res.json())
                                .then(json => {
                                    if (Array.isArray(json)) {
                                        setData(json); // superadmin or regular user will get appropriate data
                                    } else {
                                        alert("Unexpected response");
                                    }
                                })
                                .catch((err) => {
                                    console.error("❌ Failed to fetch updated records:", err);
                                    alert("Failed to refresh records");
                                });
                        }}
                    />

                )}

                {user.role === 'superadmin' && (
                    <>
                        {error.users && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                                {error.users}
                            </div>
                        )}

                        <UserForm
                            apiUrl={`${API_URL}/users/add`}
                            username={user.username}
                            token={user.token}
                            onSuccess={fetchUsers}
                        />

                        {loading.users ? (
                            <div className="text-center py-8 text-gray-600">Loading users...</div>
                        ) : (
                            <UserTable
                                users={users}
                                setUsers={setUsers}
                                apiUrl={API_URL}
                                token={user.token}
                                onUserUpdate={fetchUsers}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
