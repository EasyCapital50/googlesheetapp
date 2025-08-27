import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FiPlus, FiEdit2, FiTrash2, FiSave, FiX, 
  FiEye, FiEyeOff, FiSearch, FiChevronDown, FiLogOut,
  FiUser, FiHome, FiSettings
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const MainAdminDashboard = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newCompany, setNewCompany] = useState({
    name: "",
    adminName: "",
    adminUsername: "",
    adminPassword: ""
  });
  const [editCompany, setEditCompany] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("sessionToken");
const API_URL = 'https://api.easycapitalsolution.com';

  // Check if user is authenticated
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Get user info from localStorage
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    if (username && role) {
      setUser({ username, role });
    }
  }, [token, navigate]);

  // Fetch companies
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/companies/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompanies(res.data);
      setFilteredCompanies(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleForceLogout();
      } else {
        setError("Failed to load companies");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCompanies();
    }
  }, [token]);

  // Search functionality
  useEffect(() => {
    const results = companies.filter(company => 
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCompanies(results);
  }, [searchTerm, companies]);

  // Force logout without API call
  const handleForceLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Logout functionality
  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/users/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      localStorage.clear();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
      // Even if API call fails, clear local storage and redirect
      localStorage.clear();
      navigate('/login', { replace: true });
    }
  };

  // Create company
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/companies/company`, newCompany, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewCompany({ name: "", adminName: "", adminUsername: "", adminPassword: "" });
      setSuccess("Company created successfully!");
      setError("");
      setIsCreating(false);
      fetchCompanies();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      if (err.response?.status === 401) {
        handleForceLogout();
      } else {
        setError(err.response?.data?.message || "Error creating company");
        setSuccess("");
      }
    }
  };

  // Update company
  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `${API_URL}/companies/company/${id}`,
        { name: editCompany.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditCompany(null);
      setSuccess("Company updated successfully!");
      setError("");
      fetchCompanies();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      if (err.response?.status === 401) {
        handleForceLogout();
      } else {
        setError(err.response?.data?.message || "Error updating company");
        setSuccess("");
      }
    }
  };

  // Delete company
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;
    try {
      await axios.delete(`${API_URL}/companies/company/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Company deleted successfully!");
      setError("");
      fetchCompanies();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      if (err.response?.status === 401) {
        handleForceLogout();
      } else {
        setError(err.response?.data?.message || "Error deleting company");
        setSuccess("");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Company Management</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.username} <span className="text-blue-600">({user?.role})</span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
              >
                <FiLogOut className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="mb-6">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4 flex justify-between items-center">
              <p>{error}</p>
              <button onClick={() => setError("")} className="text-red-700">
                <FiX />
              </button>
            </div>
          )}
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-4 flex justify-between items-center">
              <p>{success}</p>
              <button onClick={() => setSuccess("")} className="text-green-700">
                <FiX />
              </button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <FiHome className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Total Companies</h3>
              <p className="text-2xl font-bold text-gray-800">{companies.length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <FiUser className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Active Users</h3>
              <p className="text-2xl font-bold text-gray-800">{companies.length * 2}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <FiSettings className="text-purple-600 text-xl" />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">System Status</h3>
              <p className="text-2xl font-bold text-gray-800">Online</p>
            </div>
          </div>
        </div>

        {/* Create Company Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div 
            className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition"
            onClick={() => setIsCreating(!isCreating)}
          >
            <h2 className="text-lg font-semibold text-gray-700">Create New Company</h2>
            <FiChevronDown className={`transform transition-transform ${isCreating ? 'rotate-180' : ''} text-gray-500`} />
          </div>
          
          {isCreating && (
            <div className="border-t border-gray-200 p-6">
              <form onSubmit={handleCreate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      placeholder="Enter company name"
                      value={newCompany.name}
                      onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Name</label>
                    <input
                      type="text"
                      placeholder="Enter admin name"
                      value={newCompany.adminName}
                      onChange={(e) => setNewCompany({ ...newCompany, adminName: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Username</label>
                    <input
                      type="text"
                      placeholder="Enter admin username"
                      value={newCompany.adminUsername}
                      onChange={(e) => setNewCompany({ ...newCompany, adminUsername: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter admin password"
                        value={newCompany.adminPassword}
                        onChange={(e) => setNewCompany({ ...newCompany, adminPassword: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
                  >
                    <FiPlus className="mr-2" />
                    Create Company
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Companies List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Companies</h2>
              <p className="text-sm text-gray-500 mt-1">Manage all companies in the system</p>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {filteredCompanies.length} items
            </span>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-500">Loading companies...</p>
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">
                {searchTerm ? "No companies match your search." : "No companies found."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredCompanies.map((company) => (
                <div key={company._id} className="p-6 hover:bg-gray-50 transition">
                  {editCompany?.id === company._id ? (
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={editCompany.name}
                          onChange={(e) =>
                            setEditCompany({ ...editCompany, name: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          autoFocus
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdate(company._id)}
                          className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center"
                        >
                          <FiSave className="mr-1" />
                          Save
                        </button>
                        <button
                          onClick={() => setEditCompany(null)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center"
                        >
                          <FiX className="mr-1" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{company.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">ID: {company._id}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditCompany({ id: company._id, name: company.name })}
                          className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition flex items-center"
                        >
                          <FiEdit2 className="mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(company._id)}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center"
                        >
                          <FiTrash2 className="mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainAdminDashboard;