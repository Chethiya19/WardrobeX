import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CustomerLayout.css'; 

export default function CustomerLayout() {
  return (
    <div 
      className="container-fluid" 
      style={{ 
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", 
        height: '550px' 
      }}
    >
      <div className="row h-100">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 bg-light border-end p-3" style={{ height: '100%' }}>
          <h5 className="mb-4">👤 Account</h5>
          <ul className="nav flex-column sidebar-nav">
            <li className="nav-item mb-2">
              <NavLink to="/customer/dashboard" className="nav-link">Account Details</NavLink>
            </li>
            <li className="nav-item mb-2">
              <NavLink to="/customer/security" className="nav-link">Account Security</NavLink>
            </li>
            <li className="nav-item mb-2">
              <NavLink to="/customer/address" className="nav-link">Address</NavLink>
            </li>
            <li className="nav-item mb-2">
              <NavLink to="/customer/orders" className="nav-link">Orders</NavLink>
            </li>
            <li className="nav-item mb-2">
              <NavLink to="/customer/wishlist" className="nav-link">WishList</NavLink>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 py-4" style={{ height: '100%', overflowY: 'auto' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
