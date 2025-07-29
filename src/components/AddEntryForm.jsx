import { useState } from 'react';

function AddEntryForm({ dataHeaders, apiUrl }) {
    const [newEntry, setNewEntry] = useState({});

    const handleChange = (e) => {
        setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
    };

    const handleAddContent = () => {
        fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify({ action: 'addContent', data: newEntry }),
        })
            .then(res => res.json())
            .then(() => window.location.reload());
    };

    return (
        <div className="bg-white shadow rounded p-4 mb-10">
            <h3 className="text-lg font-semibold mb-4">Add New Entry</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {dataHeaders.map(field => (
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
    );
}

export default AddEntryForm;
