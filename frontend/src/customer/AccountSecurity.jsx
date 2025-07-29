import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function AccountSecurity() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleReset = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Mismatch!',
        text: 'New password and confirm password do not match.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    axios.post('http://localhost:5000/api/customer/reset-password', {
      oldPassword,
      newPassword,
    }, { withCredentials: true })
      .then((res) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Password reset successfully.',
          confirmButtonColor: '#000'
        });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: err.response?.data?.message || 'Failed to reset password.',
          confirmButtonColor: '#d33'
        });
      });
  };

  return (
    <div className="card border-0 shadow rounded-4 mt-4">
      <div className="card-header bg-white border-bottom">
        <h3 className="mb-0 fw-semibold">Account Security</h3>
      </div>
      <div className="card-body">
        <h5 className="mb-3 text-secondary">Reset Password</h5>

        <form onSubmit={handleReset}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Old Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Re-enter New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-dark rounded-3 px-4">
            Reset Password
          </button>
        </form>
      </div>

      <div className="card-footer text-muted text-center bg-light rounded-bottom-4">
        WardrobeX – Stay Secure 🔒
      </div>
    </div>
  );
}
