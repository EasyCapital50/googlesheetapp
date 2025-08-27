import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { useState, useEffect } from "react";
import CompanyListPage from "./components/Companies";
import MainAdminDashboard from "./components/MainAdminDashboard";

function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('sessionToken');
    return token ? {
      name: localStorage.getItem('username'),
      role: localStorage.getItem('role'),
      token: token
    } : null;
  });

  const [redirectPath, setRedirectPath] = useState(null);

  const handleLogin = (username, role, token) => {
    const userData = { name: username, role, token };
    setUser(userData);
    
    // Set redirect path based on role
    if (role === 'mainadmin') {
      setRedirectPath('/main-admin');
    } else {
      setRedirectPath('/dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setRedirectPath(null);
    localStorage.clear();
  };

  // Clear redirect path after navigation
  useEffect(() => {
    if (redirectPath) {
      setRedirectPath(null);
    }
  }, [redirectPath]);

  return (
    <Router>
      <Routes>
        {/* 👇 Landing page now points to /companies */}
        <Route path="/" element={<Navigate to="/companies" replace />} />

        <Route
          path="/login"
          element={
            user ? (
              redirectPath ? (
                <Navigate to={redirectPath} replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            user ? (
              user.role === 'mainadmin' ? (
                <Navigate to="/main-admin" replace />
              ) : (
                <Dashboard user={user} onLogout={handleLogout}/>
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route 
          path="/main-admin" 
          element={
            user && user.role === 'mainadmin' ? (
              <MainAdminDashboard user={user} onLogout={handleLogout} />
            ) : user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route path="/companies" element={<CompanyListPage />} />
      </Routes>
    </Router>
  );
}

export default App;