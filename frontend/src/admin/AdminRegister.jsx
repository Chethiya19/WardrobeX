import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminRegister() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:5000/api/admin/register', formData, { withCredentials: true });
    localStorage.setItem('role', res.data.role);
    navigate('/admin-login');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Admin Register</h2>
      <input name="username" onChange={e => setFormData({ ...formData, username: e.target.value })} placeholder="Username" />
      <input name="email" onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="Email" />
      <input name="password" type="password" onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  );
}