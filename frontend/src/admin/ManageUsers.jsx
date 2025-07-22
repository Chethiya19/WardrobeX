import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManageUsers() {
  const [users, setUsers] = useState([]); // array of combined user + account detail
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, accountDetailsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/customers', { withCredentials: true }),
          axios.get('http://localhost:5000/api/admin/accountdetails', { withCredentials: true }),
        ]);

        const customers = customersRes.data;
        const accountDetails = accountDetailsRes.data;

        // Combine by matching customerId (_id in Customer === customerId in AccountDetail)
        const combinedUsers = customers.map((customer) => {
          const account = accountDetails.find(
            (acc) => acc.customerId === customer._id || (acc.customerId && acc.customerId._id === customer._id)
          );
          return {
            _id: customer._id,
            username: customer.username || '', 
            email: customer.email || '',
            firstName: account?.firstName || '',
            lastName: account?.lastName || '',
            phone: account?.phone || '',
          };
        });

        setUsers(combinedUsers);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Unauthorized or failed to load users');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <header className="top-bar">
        <h2>Customers</h2>
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
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Username</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Contact</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id} style={trStyle}>
                    <td style={tdStyle}>{index + 1}</td>
                    <td style={tdStyle}>
                      {user.firstName} {user.lastName}
                    </td>
                    <td style={tdStyle}>{user.username}</td>
                    <td style={tdStyle}>{user.email}</td>
                    <td style={tdStyle}>{user.phone}</td>
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
  textAlign: 'center',
};

const thStyle = {
  position: 'sticky',
  top: 0,
  backgroundColor: '#d2d2d2',
  color: '#111',
  padding: '12px 20px',
  fontWeight: '600',
  fontSize: '1rem',
  userSelect: 'none',
  borderBottom: '3px solid #ccc',
};

const trStyle = {
  transition: 'background-color 0.3s ease',
  cursor: 'default',
};

const tdStyle = {
  padding: '14px 20px',
  borderBottom: '1px solid #e5e7eb', // Tailwind gray-200
  fontSize: '0.95rem',
  color: '#20252eff',
};
