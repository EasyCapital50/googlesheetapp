import React, { useState } from 'react';

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
};

function DataTable({ data, searchTerm, user, apiUrl, token, onDeleteSuccess, onEditSuccess }) {
  const excludedFields = ['_id', '__v', 'createdAt', 'updatedAt'];

  const [editingRow, setEditingRow] = useState(null);
  const [editValues, setEditValues] = useState({});

const filteredData = data.filter(row =>
  Object.values(row).some(val =>
    val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  )
);

// Show table only:
// - If superadmin: always show
// - If staff/user: only show if search has results
const shouldShowTable =
  user.role === 'superadmin' ||
  (searchTerm.trim().length > 0 && filteredData.length > 0);

if (!shouldShowTable) return null;



  const canEdit = (row) =>
    user.role === 'superadmin' || (user.role === 'staff' && row.createdBy?._id === user._id);

  const handleDeleteRow = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this record?`)) return;

    try {
      const res = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await res.json();
      alert(result.message || "✅ Record deleted.");
      onDeleteSuccess?.();
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("Delete failed. Please try again.");
    }
  };

  const handleEditRow = (row) => {
    setEditingRow(row._id);
    setEditValues(row);
  };

  const handleEditChange = (e) => {
    setEditValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editValues),
      });

      const result = await res.json();
      alert(result.message || "✅ Record updated.");
      setEditingRow(null);
      onEditSuccess?.();
    } catch (err) {
      console.error("❌ Update failed:", err);
      alert("Update failed. Try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditValues({});
  };

  return (
    <div className="overflow-x-auto shadow rounded mb-8">
      <table className="min-w-full text-sm border border-gray-300">
        <thead className="bg-green-600 text-white">
          <tr>
            {data[0] &&
              Object.keys(data[0])
                .filter(key => !excludedFields.includes(key) && key !== 'createdBy')
                .map((key, i) => (
                  <th key={i} className="px-4 py-2 border">
                    {labelMap[key] || key}
                  </th>
                ))}
            {user.role === 'superadmin' && (
              <th className="px-4 py-2 border">Created By</th>
            )}

            {(user.role === 'superadmin' || user.role === 'staff') && (
              <th className="px-4 py-2 border">Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {filteredData.map((row, i) => (
            <tr key={i} className="even:bg-gray-100">
              {Object.keys(labelMap).map((key, j) => (
  <td key={j} className="px-3 py-2 border">
    {editingRow === row._id ? (
      <input
        type="text"
        name={key}
        value={editValues[key] || ''}
        onChange={handleEditChange}
        className="border px-2 py-1 rounded w-full"
      />
    ) : (
      row[key] || '—'  // fallback for missing values
    )}
  </td>
))
}

              {/* Show Created By */}
              {user.role === 'superadmin' && (
                <td className="px-3 py-2 border text-gray-500">
                  {row.createdBy?.username || "—"}
                </td>
              )}


              {/* Actions */}
              {(user.role === 'superadmin' || user.role === 'staff') && (
                <td className="px-3 py-2 border space-x-2">
                  {editingRow === row._id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(row._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      {canEdit(row) && (
                        <button
                          onClick={() => handleEditRow(row)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                      )}
                      {user.role === 'superadmin' && (
                        <button
                          onClick={() => handleDeleteRow(row._id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      )}
                    </>
                  )}
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
