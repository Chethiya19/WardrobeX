// src/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/me', { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => navigate('/'));
  }, []);

  return (
    <>
      <header className="top-bar">
        <h2>Welcome, {user?.username || 'Admin'}</h2>
      </header>
      <section className="content-area">
        <p><strong>Email:</strong> {user?.email}</p>
        <p>This is your admin dashboard. Use the sidebar to navigate.</p>
      </section>
    </>
  );
}
