import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHome, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Address() {
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();

  const fetchAddresses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/address/view', {
        withCredentials: true,
      });

      if (Array.isArray(res.data) && res.data.length > 0) {
        setAddresses(res.data);
      } else {
        setAddresses([]);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this address?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/address/delete/${id}`, {
          withCredentials: true,
        });
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Address has been removed.',
          confirmButtonColor: '#000',
        });
        fetchAddresses(); // refresh the list
      } catch (err) {
        console.error('Error deleting address:', err);
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: 'Failed to delete the address. Please try again.',
          confirmButtonColor: '#d33',
        });
      }
    }
  };

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

      {addresses.length > 0 ? (
        addresses.map((address) => (
          <div
            key={address._id}
            className="border rounded-3 p-3 d-flex justify-content-between align-items-start gap-3 bg-light mb-3"
          >
            <div
              className="d-flex gap-3"
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

            <button
              className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
              onClick={() => handleDelete(address._id)}
              title="Delete Address"
            >
              <FaTrash />
              Remove
            </button>
          </div>
        ))
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
