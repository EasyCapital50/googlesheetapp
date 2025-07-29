import { useState } from 'react';

function UserForm({ apiUrl, username }) {
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });

    const handleChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleAddUser = () => {
        fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify({
                action: 'addUser',
                user: newUser,
                addedBy: username
            })
        })
            .then(res => res.json())
            .then(() => {
                alert('User added!');
                window.location.reload();
            });
    };

    return (
        <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold mb-4">Add New User</h3>
            <div className="flex flex-col md:flex-row gap-3 mb-4">
                <input
                    name="username"
                    placeholder="Username"
                    value={newUser.username}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 text-sm flex-1"
                />
                <input
                    name="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 text-sm flex-1"
                />
                <select
                    name="role"
                    value={newUser.role}
                    onChange={handleChange}
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
    );
}

export default UserForm;
