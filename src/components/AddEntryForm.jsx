import { useState } from 'react';

const labelMap = {
  companyName: "Company Name",
  customerName: "Customer Name",
  mobile: "Mobile",
  place: "Place",
  bank: "Bank",
  to: "T/o",
  appDate: "App Date",
  status: "Status",
  remarks: "Remarks",
natureOfBsns: "Nature of Business",     // ✅ Add this
  styleOfBsns: "Style of Business",       // ✅ And this
};

function AddEntryForm({ dataHeaders, apiUrl, token, onSuccess }) {
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

            // ✅ Call onSuccess to trigger re-fetch in parent
            if (onSuccess) {
                onSuccess();
            }

            // Optional: Clear the form
            setNewEntry({});
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
                    .filter(field => !['_id', '__v', 'createdAt', 'updatedAt', 'createdBy'].includes(field))
                    .map(field => (
                        <input
                            key={field}
                            name={field}
                            value={newEntry[field] || ""}
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
