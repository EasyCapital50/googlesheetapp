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


function DataTable({ data, searchTerm, user, apiUrl, token, onDeleteSuccess }) {  const excludedFields = ['_id', '__v', 'createdAt', 'updatedAt'];

  const filteredData = data.filter(row =>
    Object.values(row).some(val =>
      val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const shouldShowTable =
    user.role === 'superadmin' || searchTerm.trim().length > 0;

  if (!shouldShowTable) return null;

  const handleDeleteRow = (id) => {
  if (!window.confirm(`Are you sure you want to delete this record?`)) return;

  fetch(`${apiUrl}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(res => {
      alert(res.message || "Deleted");
      // ✅ Call parent to re-fetch
      if (onDeleteSuccess) onDeleteSuccess();
    })
    .catch(() => alert("Delete failed"));
};


  return (
    <div className="overflow-x-auto shadow rounded mb-8">
      <table className="min-w-full text-sm border border-gray-300">
        <thead className="bg-green-600 text-white">
          <tr>
            {data[0] &&
              Object.keys(data[0])
                .filter((key) => !excludedFields.includes(key))
                .map((key, i) => (
                  <th key={i} className="px-4 py-2 border">
                    {labelMap[key] || key}
                  </th>
                ))
            }
            {user.role === 'superadmin' && (
              <th className="px-4 py-2 border">Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {filteredData.map((row, i) => (
            <tr key={i} className="even:bg-gray-100">
              {Object.entries(row)
                .filter(([key]) => !excludedFields.includes(key))
                .map(([key, val], j) => (
                  <td key={j} className="px-3 py-2 border">
                    {val?.toString()}
                  </td>
                ))}

              {user.role === 'superadmin' && (
                <td className="px-3 py-2 border">
                  <button
                    onClick={() => handleDeleteRow(row._id)}
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
