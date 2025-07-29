import { useState } from 'react';

const labelMap = {
  companyName: "Company Name",
  customerName: "Customer Name",
  mobile: "Mobile",
  place: "Place",
  to: "T/o",
  appDate: "App Date",
  status: "Status",
  remarks: "Remarks",
};

function AddEntryForm({ dataHeaders, apiUrl,token }) {
    const [newEntry, setNewEntry] = useState({});

    const handleChange = (e) => {
        setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
    };

    const handleAddContent = async () => {
        try {
            const res = await fetch(`${apiUrl}/records/post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newEntry),
            });

            if (!res.ok) {
                const errorData = await res.json();
                alert(`❌ Error: ${errorData.error}`);
                return;
            }

            const created = await res.json();
            console.log("✅ Record created:", created);
            window.location.reload();
        } catch (error) {
            console.error("❌ Failed to add entry:", error);
            alert("Something went wrong. Try again.");
        }
    };

    return (
        <div className="bg-white shadow rounded p-4 mb-10">
            <h3 className="text-lg font-semibold mb-4">Add New Entry</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
{dataHeaders
    .filter(field => !['_id', '__v', 'createdAt', 'updatedAt'].includes(field))
    .map(field => (
                    <input
                        key={field}
                        name={field}
                        placeholder={labelMap[field] || field}
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
