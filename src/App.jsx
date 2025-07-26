import { useState, useEffect } from 'react';
import React from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);

  // ✅ Load session from localStorage on first render
  useEffect(() => {
    const token = localStorage.getItem('sessionToken');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    if (token && username && role) {
      setUser({ username, role, token });
    }
  }, []);

  if (!user) {
    return <Login onLogin={(username, role, token) => setUser({ username, role, token })} />;
  }

return <Dashboard user={user} onLogout={() => setUser(null)} />;
}

export default App;
