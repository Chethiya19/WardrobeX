import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/admin/customers', { withCredentials: true })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Unauthorized or failed to load users');
        setLoading(false);
      });
  }, []);

  return (
    <>
      <header className="top-bar">
        <h2>Manage Users</h2>
      </header>
      <section className="content-area">
        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Username</th>
                  <th style={thStyle}>Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} style={trStyle}>
                    <td style={tdStyle}>{user.username}</td>
                    <td style={tdStyle}>{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

const tableContainerStyle = {
  overflowX: 'auto',
  boxShadow: '0 4px 10px rgb(0 0 0 / 0.1)',
  borderRadius: '8px',
  backgroundColor: '#fff',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: 0,
  minWidth: '400px',
};

const thStyle = {
  position: 'sticky',
  top: 0,
  backgroundColor: '#d2d2d2', 
  color: '#111',
  padding: '12px 20px',
  textAlign: 'left',
  fontWeight: '600',
  fontSize: '1rem',
  userSelect: 'none',
  borderBottom: '3px solidrgb(190, 230, 224)',
};

const trStyle = {
  transition: 'background-color 0.3s ease',
  cursor: 'default',
};

const tdStyle = {
  padding: '14px 20px',
  borderBottom: '1px solid #e5e7eb', // Tailwind gray-200
  fontSize: '0.95rem',
  color: '#374151', // gray-700
};

