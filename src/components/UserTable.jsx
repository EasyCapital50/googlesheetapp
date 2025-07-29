function UserTable({ users, setUsers, apiUrl }) {
    const handleChange = (index, field, value) => {
        const updated = [...users];
        updated[index][field] = value;
        setUsers(updated);
    };

    const handleUpdate = (index) => {
        const u = users[index];
        fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify({
                action: 'editUser',
                rowNumber: u.row,
                updatedUser: { username: u.username, password: u.password, role: u.role }
            })
        }).then(() => {
            alert('User updated!');
            window.location.reload();
        });
    };

    const handleDelete = (rowNumber) => {
        if (!window.confirm('Delete this user?')) return;
        fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify({ action: 'deleteUser', rowNumber })
        }).then(() => {
            alert('User deleted!');
            window.location.reload();
        });
    };

    return (
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
                                        value={u.username}
                                        onChange={(e) => handleChange(i, 'username', e.target.value)}
                                        className="w-full border rounded px-2 py-1"
                                    />
                                </td>
                                <td className="px-3 py-2 border">
                                    <input
                                        value={u.password}
                                        onChange={(e) => handleChange(i, 'password', e.target.value)}
                                        className="w-full border rounded px-2 py-1"
                                    />
                                </td>
                                <td className="px-3 py-2 border">
                                    <select
                                        value={u.role}
                                        onChange={(e) => handleChange(i, 'role', e.target.value)}
                                        className="w-full border rounded px-2 py-1"
                                    >
                                        <option value="user">User</option>
                                        <option value="staff">Staff</option>
                                        <option value="superadmin">Super Admin</option>
                                    </select>
                                </td>
                                <td className="px-3 py-2 border flex gap-2 justify-center">
                                    <button
                                        onClick={() => handleUpdate(i)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => handleDelete(u.row)}
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
    );
}

export default UserTable;
