import React from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import './AdminLayout.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/admin/logout',
        {},
        { withCredentials: true }
      );
      localStorage.clear();
      navigate('/admin-login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <div className="nav-wrapper">
          <nav>
            <ul>
              <li
                className={isActive('/admin-dashboard') ? 'selected' : ''}
                onClick={() => navigate('/admin-dashboard')}
              >
                Dashboard
              </li>
              <li
                className={isActive('/admin/users') ? 'selected' : ''}
                onClick={() => navigate('/admin/users')}
              >
                Users
              </li>
              <li
                className={isActive('/admin/products') ? 'selected' : ''}
                onClick={() => navigate('/admin/products')}
              >
                Products
              </li>
            </ul>
          </nav>
        </div>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
