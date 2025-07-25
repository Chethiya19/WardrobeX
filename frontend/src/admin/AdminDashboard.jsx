import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaTshirt, FaShoppingBag, FaUserFriends } from 'react-icons/fa';

const iconStyle = {
  fontSize: '3rem',
  marginBottom: '1rem',
};

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [counts, setCounts] = useState({ customers: 0, products: 0, orders: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/me', { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => navigate('/'));

    const fetchCounts = async () => {
      try {
        const [customerRes, productRes, orderRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/customers/count', { withCredentials: true }),
          axios.get('http://localhost:5000/api/admin/products/count', { withCredentials: true }),
          axios.get('http://localhost:5000/api/admin/orders/count', { withCredentials: true }),
        ]);
        setCounts({
          customers: customerRes.data.totalCustomers,
          products: productRes.data.totalProducts,
          orders: orderRes.data.totalOrders,
        });
      } catch (err) {
        console.error('Error fetching counts:', err);
      }
    };

    fetchCounts();
  }, [navigate]);

  return (
    <div className="container py-4">
      <div className="bg-secondary text-white p-4 rounded mb-4">
        <h2 className="mb-0">Welcome, {user?.username || 'Admin'}</h2>
        <p className="mb-0"><strong>Email:</strong> {user?.email}</p>
      </div>

      <div className="row g-4">
        {/* Customers Card */}
        <div className="col-md-4">
          <div className="card shadow border-0 h-100 text-center text-primary">
            <div className="card-body">
              <FaUserFriends style={iconStyle} />
              <h5 className="card-title">Total Customers</h5>
              <h2 className="fw-bold">{counts.customers}</h2>
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="col-md-4">
          <div className="card shadow border-0 h-100 text-center text-success">
            <div className="card-body">
              <FaTshirt style={iconStyle} />
              <h5 className="card-title">Total Products</h5>
              <h2 className="fw-bold">{counts.products}</h2>
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="col-md-4">
          <div className="card shadow border-0 h-100 text-center text-warning">
            <div className="card-body">
              <FaShoppingBag style={iconStyle} />
              <h5 className="card-title">Total Orders</h5>
              <h2 className="fw-bold">{counts.orders}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
