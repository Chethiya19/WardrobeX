import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CustomerDashboard() {
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  // const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/customer/me', { withCredentials: true })
      .then(res => {
        setUser(res.data);
        // Then fetch account details
        return axios.get('http://localhost:5000/api/account-details/me', { withCredentials: true });
      })
      .then(res => {
        if (res.data) {
          setFirstName(res.data.firstName || '');
          setLastName(res.data.lastName || '');
          setPhone(res.data.phone || '');
        }
      })
      .catch(err => {
        console.log(err);
        // navigate('/home');
      });
  }, []);

  const handleSave = () => {
    axios.post('http://localhost:5000/api/account-details/save', {
      firstName,
      lastName,
      phone
    }, { withCredentials: true })
      .then(res => {
        alert('Account details saved successfully!');
      })
      .catch(err => {
        console.error(err);
        alert('Failed to save account details');
      });
  };

  return (
    <div className="card border-0 shadow rounded-4">
      <div className="card-header bg-white border-bottom">
        <h3 className="mb-0 fw-semibold">Account Details</h3>
      </div>
      <div className="card-body">
        <p className="text-muted">
          {user?.username} ({user?.email})
          <span className="badge bg-secondary ms-2">Member</span>
        </p>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">First Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Last Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Phone Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="Please Enter Your Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <button className="btn btn-dark rounded-3 px-4" onClick={handleSave}>
          Save Changes
        </button>
      </div>
      <div className="card-footer text-muted text-center bg-light rounded-bottom-4">
        WardrobeX – Stay Stylish ✨
      </div>
    </div>
  );
}
