import { useState } from 'react';

function UserForm({ apiUrl, token, onSuccess }) {
    const [newUser, setNewUser] = useState({
        name: '',
        username: '',
        password: '',
        role: 'user'
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleAddUser = () => {
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(newUser)
        })
            .then(res => res.json())
            .then(res => {
                if (res.message) {
                    alert(res.message);
                } else {
                    alert('User added!');
                    if (typeof onSuccess === 'function') {
                        onSuccess(); // <-- call fetchUsers or any callback
                    }
                    setNewUser({
                        name: '',
                        username: '',
                        password: '',
                        role: 'user'
                    });
                }
            })
            .catch(err => alert('Error adding user: ' + err.message));
    };

    return (
        <div className="bg-white shadow rounded p-4">
            <h3 className="text-lg font-semibold mb-4">Add New User</h3>
            <div className="flex flex-col md:flex-row gap-3 mb-4">
                <input
                    name="name"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 text-sm flex-1"
                />
                <input
                    name="username"
                    placeholder="Username"
                    value={newUser.username}
                    onChange={handleChange}
                    className="border rounded px-3 py-2 text-sm flex-1"
                />
                <div className="relative flex-1">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={handleChange}
                        className="border rounded px-3 py-2 text-sm w-full"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-blue-600"
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>
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
