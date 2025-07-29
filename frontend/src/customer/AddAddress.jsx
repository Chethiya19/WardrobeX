import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function Address() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    street: '',
    city: '',
    district: '',
    province: '',
    landmark: '',
    zipcode: '',
  });

  const provinces = [
    'Western', 'Eastern', 'Northern', 'Southern', 'Central',
    'North Western', 'North Central', 'Uva', 'Sabaragamuwa',
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'province' && { district: '' }), // Reset district if province changes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/address/add', formData, {
        withCredentials: true,
      });

      // ✅ Success Alert
      await Swal.fire({
        icon: 'success',
        title: 'Address Added Successfully',
        text: 'Your address has been saved.',
        confirmButtonColor: '#000',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      // Reset form
      setFormData({
        street: '',
        city: '',
        district: '',
        province: '',
        landmark: '',
        zipcode: '',
      });

      // Optional: Navigate back to address view
      navigate('/customer/address');
    } catch (error) {
      console.error('Error adding address:', error);

      // ❌ Error Alert
      Swal.fire({
        icon: 'error',
        title: 'Failed to Add Address',
        text: error.response?.data?.message || 'Something went wrong. Please try again.',
        confirmButtonColor: '#d33',
      });
    }
  };

  return (
    <div className="card border-0 shadow rounded-4">
      <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
        <h3 className="mb-0 fw-semibold">Add New Address</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label fw-semibold">Street Address</label>
            <input
              type="text"
              className="form-control"
              name="street"
              placeholder="Street, House No / Apartment No"
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
                placeholder="Enter City or Town"
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
                {provinces.map((province) => (
                  <option key={province} value={province}>{province}</option>
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
                {districtsByProvince[formData.province]?.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Zipcode</label>
              <input
                type="text"
                className="form-control"
                name="zipcode"
                placeholder="Enter Zipcode"
                value={formData.zipcode}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Detailed Landmark</label>
            <input
              type="text"
              className="form-control"
              name="landmark"
              placeholder="E.g. Near ABC School, Behind XYZ Store"
              value={formData.landmark}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-dark rounded-3 px-4">
            Add Address
          </button>
        </div>
      </form>
    </div>
  );
}
