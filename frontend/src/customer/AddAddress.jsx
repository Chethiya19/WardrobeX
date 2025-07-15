import React, { useState } from 'react';
import axios from 'axios';

export default function Address() {
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
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'province' && { district: '' }), // Reset district when province changes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/address/save', formData, {
        withCredentials: true,
      });
      alert('Address added successfully!');
      setFormData({
        street: '',
        city: '',
        district: '',
        province: '',
        landmark: '',
        zipcode: '',
      });
    } catch (error) {
      console.error('Error adding address:', error);
      alert('Failed to add address.');
    }
  };

  return (
    <div className="card border-0 shadow rounded-4">
      <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
        <h3 className="mb-0 fw-semibold">Address</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="card-body">
          {/* Street */}
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

          {/* City & Province */}
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
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
            </div>
          </div>

          {/* District & Zipcode */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">District</label>
              <select
                className="form-select"
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
              >
                <option value="">Select District</option>
                {districtsByProvince[formData.province]?.map(district => (
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

          {/* Landmark */}
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

          {/* Submit */}
          <button type="submit" className="btn btn-dark w-10 rounded-3">
            Add Address
          </button>
        </div>
      </form>
    </div>
  );
}
