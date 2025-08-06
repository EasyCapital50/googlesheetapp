import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // Optional: lucide-react icons

function UserTable({ users = [], setUsers, apiUrl, token, onUserUpdate }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [visiblePasswords, setVisiblePasswords] = useState({}); // {userId: true/false}

    const handleChange = (index, field, value) => {
        const updated = [...users];
        updated[index] = { ...updated[index], [field]: value };
        setUsers(updated);
    };

    const togglePasswordVisibility = (userId) => {
        setVisiblePasswords((prev) => ({
            ...prev,
            [userId]: !prev[userId],
        }));
    };

    const handleUpdate = async (user) => {
    if (!user.username || !user.role) {
        setError('Username and role are required');
        return;
    }

    const confirmed = window.confirm(`Are you sure you want to save changes for "${user.username}"?`);
    if (!confirmed) return;

    setLoading(true);
    setError(null);

    try {
        const response = await fetch(`${apiUrl}/users/edit/${user._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                username: user.username,
                password: user.password || undefined,
                role: user.role,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update user');
        }

        alert('User updated!');
        if (typeof onUserUpdate === 'function') {
            onUserUpdate(); // ✅ Refresh user list without reload
        }
    } catch (err) {
        console.error("Update error:", err);
        setError(err.message);
    } finally {
        setLoading(false);
    }
};


    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${apiUrl}/users/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete user');
            }

            onUserUpdate(); // refresh user list
        } catch (err) {
            console.error("Delete error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-10">
            <h3 className="text-lg font-semibold mb-4">Manage Users</h3>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                    {error}
                </div>
            )}

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
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            users.map((user, index) => (
                                <tr key={user._id} className="even:bg-gray-100 hover:bg-gray-50">
                                    <td className="px-3 py-2 border">
                                        <input
                                            value={user.username}
                                            onChange={(e) => handleChange(index, 'username', e.target.value)}
                                            className="w-full border rounded px-2 py-1"
                                            disabled={loading}
                                        />
                                    </td>
                                    <td className="px-3 py-2 border">
                                        <div className="flex items-center">
                                            <input
                                                type={visiblePasswords[user._id] ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                value={user.password || ''}
                                                onChange={(e) => handleChange(index, 'password', e.target.value)}
                                                className="w-full border rounded px-2 py-1"
                                                disabled={loading}
                                            />
                                            <button
                                                type="button"
                                                className="ml-2 text-gray-600"
                                                onClick={() => togglePasswordVisibility(user._id)}
                                                disabled={loading}
                                            >
                                                {visiblePasswords[user._id] ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 border">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleChange(index, 'role', e.target.value)}
                                            className="w-full border rounded px-2 py-1"
                                            disabled={loading}
                                        >
                                            <option value="user">User</option>
                                            <option value="staff">Staff</option>
                                            <option value="superadmin">Super Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-3 py-2 border">
                                        <div className="flex gap-2 justify-center">
                                            <button
                                                onClick={() => handleUpdate(user)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded disabled:opacity-50"
                                                disabled={loading}
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded disabled:opacity-50"
                                                disabled={loading}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserTable;
