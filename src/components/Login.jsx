import React, { useState } from 'react';

const API_URL = 'https://script.google.com/macros/s/AKfycbxU2-SWZ_i7TfjTbbeaLjTKBLGWgSftiV_iWyDl5-Jc4pkO-RSU4GRCH6SNQHtKkVpU/exec';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
               action: "login",
        username,
        password
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.success) {
          // ✅ Save session token in localStorage
          localStorage.setItem('sessionToken', res.token);
          localStorage.setItem('username', username);
          localStorage.setItem('role', res.role);

          onLogin(username, res.role); // inform parent
        } else {
          alert("Login failed: " + res.message);
        }
      })
      .catch(err => {
        console.error("Login error:", err);
        alert("Something went wrong. Please try again.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-center text-xl font-bold mb-6">Login</h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="mb-6 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 text-sm"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
