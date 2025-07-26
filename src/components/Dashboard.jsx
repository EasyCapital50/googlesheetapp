import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://script.google.com/macros/s/AKfycbxU2-SWZ_i7TfjTbbeaLjTKBLGWgSftiV_iWyDl5-Jc4pkO-RSU4GRCH6SNQHtKkVpU/exec';

function Dashboard({ user: userProp, onLogout }) {
    const navigate = useNavigate();

    // 👇 Load user from localStorage if not passed as prop
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('sessionToken');
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');
        return token && username && role ? { token, username, role } : null;
    });

    const [data, setData] = useState([]);
    const [newEntry, setNewEntry] = useState({});
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });
    const [users, setUsers] = useState([]);

    // ⛔ Redirect if not logged in
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        fetch(API_URL)
            .then(res => res.json())
            .then(setData);

        if (user.role === 'superadmin') {
            fetchUsers(); // Load user list if superadmin
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
    };

    const handleAddContent = () => {
        fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'addContent',
                data: newEntry,
            })
        })
            .then(res => res.json())
            .then(() => window.location.reload());
    };

    const handleNewUserChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleAddUser = () => {
        fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'addUser',
                user: newUser,
                addedBy: user.username
            })
        })
            .then(res => res.json())
            .then(() => {
                alert('User added successfully!');
                window.location.reload(); // ✅ Reload after success
            })
            .catch(err => alert('Error adding user: ' + err.message));
    };


    const fetchUsers = () => {
        fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'listUsers' })
        })
            .then(res => res.json())
            .then(setUsers)
            .catch(err => {
                console.error('Error fetching users:', err);
            });
    };

    const handleUserFieldChange = (index, field, value) => {
        const updated = [...users];
        updated[index][field] = value;
        setUsers(updated);
    };

    const handleUpdateUser = (index) => {
        const userToUpdate = users[index];
        fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'editUser',
                rowNumber: userToUpdate.row,
                updatedUser: {
                    username: userToUpdate.username,
                    password: userToUpdate.password,
                    role: userToUpdate.role
                }
            })
        })
            .then(res => res.json())
            .then(() => {
                alert('User updated!');
                window.location.reload(); // ✅ Reload page after update
            });
    };


    const handleDeleteUser = (rowNumber) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'deleteUser',
                rowNumber
            })
        })
            .then(res => res.json())
            .then(() => {
                alert('User deleted!');
                window.location.reload(); // ✅ Reload page after delete
            });
    };


    const handleDeleteRow = (rowNumber) => {
        if (!window.confirm(`Are you sure you want to delete row ${rowNumber}?`)) return;

        fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'deleteRow',
                rowNumber
            }),
        })
            .then(res => res.json())
            .then((data) => {
                if (data.success) {
                    alert(data.message);
                    window.location.reload();
                } else {
                    alert("Error: " + data.message);
                }
            })
            .catch(err => {
                console.error('Delete error:', err);
                alert("Something went wrong!");
            });
    };

    const handleLogout = () => {
        fetch(API_URL, {
            method: 'POST',

            body: JSON.stringify({ action: 'logout' }),
        })
            .then(res => res.json())
            .then(response => {
                if (response.success) {
                    localStorage.removeItem("sessionToken");
                    localStorage.removeItem("role");
                    localStorage.removeItem("username");
                    onLogout();
                } else {
                    alert("Logout failed: " + response.message);
                }
            })
            .catch(err => {
                console.error('Logout error:', err);
                alert("Something went wrong during logout.");
            });
    };
    ``
    // ⚠️ Avoid rendering until user is set (prevents errors)
    if (!user) return null;

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
            <button onClick={handleLogout} className="mb-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Logout
            </button>

            <h2 className="text-2xl font-bold mb-6">Welcome, {user.username} <span className="text-gray-500">({user.role})</span></h2>

            {/* Table */}
            <div className="overflow-x-auto shadow rounded mb-8">
                <table className="min-w-full text-sm border border-gray-300">
                    <thead className="bg-green-600 text-white">
                        <tr>
                            {data[0] && Object.keys(data[0]).map((key, i) => (
                                <th key={i} className="px-4 py-2 border">{key}</th>
                            ))}

                            {user.role !== 'user' && (
                                <th className="px-4 py-2 border">Actions</th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i} className="even:bg-gray-100">
                                {Object.values(row).map((val, j) => (
                                    <td key={j} className="px-3 py-2 border">{val}</td>
                                ))}
                                {user.role !== 'user' && (
                                    <td className="px-3 py-2 border">
                                        <button
                                            onClick={() => handleDeleteRow(i + 2)}
                                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                )}


                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

            {/* Add New Entry */}
            {(user.role === 'staff' || user.role === 'superadmin') && (
                <div className="bg-white shadow rounded p-4 mb-10">
                    <h3 className="text-lg font-semibold mb-4">Add New Entry</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                        {data[0] && Object.keys(data[0]).map(field => (
                            <input
                                key={field}
                                name={field}
                                placeholder={field}
                                onChange={handleChange}
                                className="border rounded px-3 py-2 text-sm"
                            />
                        ))}
                    </div>
                    <button
                        onClick={handleAddContent}
                        className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded"
                    >
                        Add Row
                    </button>
                </div>
            )}

            {/* Super Admin: Add New User */}
            {user.role === 'superadmin' && (
                <div className="bg-white shadow rounded p-4">
                    <h3 className="text-lg font-semibold mb-4">Add New User</h3>
                    <div className="flex flex-col md:flex-row gap-3 mb-4">
                        <input
                            type="text"
                            name="username"
                            placeholder="New Username"
                            value={newUser.username}
                            onChange={handleNewUserChange}
                            className="border rounded px-3 py-2 text-sm flex-1"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="New Password"
                            value={newUser.password}
                            onChange={handleNewUserChange}
                            className="border rounded px-3 py-2 text-sm flex-1"
                        />
                        <select
                            name="role"
                            value={newUser.role}
                            onChange={handleNewUserChange}
                            className="border rounded px-3 py-2 text-sm flex-1"
                        >
                            <option value="user">User</option>
                            <option value="staff">Staff</option>
                            <option value="superadmin">Super Admin</option>
                        </select>
                    </div>
                    <button
                        onClick={handleAddUser}
                        className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded"
                    >
                        Add User
                    </button>
                </div>
            )}

            {user.role === 'superadmin' && (
                <>
                    <h3 className="text-lg font-semibold mt-10 mb-4">Manage Users</h3>
                    <div className="overflow-x-auto shadow rounded mb-6">
                        <table className="min-w-full text-sm border border-gray-300">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="px-4 py-2 border">Username</th>
                                    <th className="px-4 py-2 border">Password</th>
                                    <th className="px-4 py-2 border">Role</th>
                                    <th className="px-4 py-2 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u, i) => (
                                    <tr key={i} className="even:bg-gray-100">
                                        <td className="px-3 py-2 border">
                                            <input
                                                type="text"
                                                value={u.username}
                                                onChange={(e) => handleUserFieldChange(i, 'username', e.target.value)}
                                                className="w-full border rounded px-2 py-1"
                                            />
                                        </td>
                                        <td className="px-3 py-2 border">
                                            <input
                                                type="text"
                                                value={u.password}
                                                onChange={(e) => handleUserFieldChange(i, 'password', e.target.value)}
                                                className="w-full border rounded px-2 py-1"
                                            />
                                        </td>
                                        <td className="px-3 py-2 border">
                                            <select
                                                value={u.role}
                                                onChange={(e) => handleUserFieldChange(i, 'role', e.target.value)}
                                                className="w-full border rounded px-2 py-1"
                                            >
                                                <option value="user">User</option>
                                                <option value="staff">Staff</option>
                                                <option value="superadmin">Super Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-3 py-2 border flex gap-2 justify-center">
                                            <button
                                                onClick={() => handleUpdateUser(i)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
                                            >
                                                Update
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(users[i].row)}
                                                className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

        </div>
    );
}

export default Dashboard;
