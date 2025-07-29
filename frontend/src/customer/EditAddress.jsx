import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function EditAddress() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    _id: '', // Required for PUT request
    street: '',
    city: '',
    district: '',
    province: '',
    landmark: '',
    zipcode: '',
  });

  const provinces = [
    'Western', 'Eastern', 'Northern', 'Southern', 'Central',
    'North Western', 'North Central', 'Uva', 'Sabaragamuwa'
  ];

  const districtsByProvince = {
    Western: ['Colombo', 'Gampaha', 'Kalutara'],
    Eastern: ['Ampara', 'Batticaloa', 'Trincomalee'],
    Northern: ['Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya'],
    Southern: ['Galle', 'Hambantota', 'Matara'],
    Central: ['Kandy', 'Matale', 'Nuwara Eliya'],
    'North Western': ['Kurunegala', 'Puttalam'],
    'North Central': ['Anuradhapura', 'Polonnaruwa'],
    Uva: ['Badulla', 'Moneragala'],
    Sabaragamuwa: ['Kegalle', 'Ratnapura'],
  };

  useEffect(() => {
    if (state) {
      setFormData(state); // includes _id
    }
  }, [state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'province' && { district: '' }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/address/update/${formData._id}`,
        formData,
        { withCredentials: true }
      );

      await Swal.fire({
        icon: 'success',
        title: 'Address Updated',
        text: 'Your address was successfully updated.',
        confirmButtonColor: '#000',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      navigate('/customer/address');
    } catch (error) {
      console.error('Error updating address:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update the address. Please try again.',
        confirmButtonColor: '#d33'
      });
    }
  };

  return (
    <div className="card border-0 shadow rounded-4">
      <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
        <h3 className="mb-0 fw-semibold">Edit Address</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label fw-semibold">Street Address</label>
            <input
              type="text"
              className="form-control"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">City / Town</label>
              <input
                type="text"
                className="form-control"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Province</label>
              <select
                className="form-select"
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
              >
                <option value="">Select Province</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">District</label>
              <select
                className="form-select"
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                disabled={!formData.province}
              >
                <option value="">Select District</option>
                {districtsByProvince[formData.province]?.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Zipcode</label>
              <input
                type="text"
                className="form-control"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Landmark</label>
            <input
              type="text"
              className="form-control"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-dark rounded-3">
            Update Address
          </button>
        </div>
      </form>
    </div>
  );
}
