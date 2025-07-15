import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Address() {
  const [address, setAddress] = useState(null);
  const navigate = useNavigate();

  const fetchAddress = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/address/view', {
        withCredentials: true,
      });
      if (res.data && res.data.street) {
        setAddress(res.data);
      } else {
        setAddress(null);
      }
    } catch (err) {
      console.error('Error fetching address:', err);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  return (
    <div className="card border-0 shadow rounded-4 p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-semibold mb-0">Addresses</h3>
        <button
          className="btn btn-dark"
          onClick={() => navigate('/customer/address/add')}
        >
          Add
        </button>
      </div>

      {address ? (
        <div
          className="border rounded-3 p-3 d-flex align-items-start gap-3 bg-light cursor-pointer"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/customer/address/edit', { state: address })}
        >
          <FaHome className="fs-1 text-secondary mt-3" />
          <div>
            <p className="mb-1"><strong>Delivery Address</strong></p>
            <p className="mb-1">{address.street}, {address.city}</p>
            <p className="mb-1">{address.district}, {address.province} Province</p>
            <p className="mb-1">{address.zipcode}</p>
            <p className="mb-0"><strong>Landmark:</strong> {address.landmark}</p>
          </div>
        </div>
      ) : (
        <div
          className="d-flex justify-content-center align-items-center rounded-3 shadow-sm"
          style={{
            backgroundColor: '#f2f2f2',
            height: '180px',
          }}
        >
          <span className="text-muted fs-5">No address found.</span>
        </div>
      )}
    </div>
  );
}
