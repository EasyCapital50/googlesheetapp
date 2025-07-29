import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('sessionToken');
    return token ? {
      name: localStorage.getItem('username'),
      role: localStorage.getItem('role'),
      token: token
    } : null;
  });

  const handleLogin = (username, role, token) => {
    setUser({ name: username, role, token });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} onLogout={handleLogout}/>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;