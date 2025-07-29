function DataTable({ data, searchTerm, user, apiUrl }) {
    const filteredData = data.filter(row =>
        Object.values(row).some(val =>
            val.toString().toLowerCase().includes(searchTerm)
        )
    );

    // Hide table unless superadmin or there's a search
    const shouldShowTable =
        user.role === 'superadmin' || searchTerm.trim().length > 0;

    if (!shouldShowTable) return null;

    const handleDeleteRow = (rowNumber) => {
        if (!window.confirm(`Delete row ${rowNumber}?`)) return;
        fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify({ action: 'deleteRow', rowNumber }),
        })
            .then(res => res.json())
            .then(res => {
                alert(res.message || "Deleted");
                window.location.reload();
            })
            .catch(() => alert("Delete failed"));
    };

    return (
        <div className="overflow-x-auto shadow rounded mb-8">
            <table className="min-w-full text-sm border border-gray-300">
                <thead className="bg-green-600 text-white">
                    <tr>
                        {data[0] && Object.keys(data[0]).map((key, i) => (
                            <th key={i} className="px-4 py-2 border">{key}</th>
                        ))}
                        {user.role === 'superadmin' && (
                            <th className="px-4 py-2 border">Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((row, i) => (
                        <tr key={i} className="even:bg-gray-100">
                            {Object.values(row).map((val, j) => (
                                <td key={j} className="px-3 py-2 border">{val}</td>
                            ))}
                            {user.role === 'superadmin' && (
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
    );
}


export default DataTable;
