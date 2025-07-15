import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import fashionImg from '../assets/fashion.svg';

export default function CustomerLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/customer/login', formData, {
        withCredentials: true,
      });
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);
      navigate('/customer/dashboard');
      window.location.reload();
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Left SVG Section */}
      <div style={styles.left}>
        <div style={styles.branding}>
          <h1 style={styles.heading}>WardrobeX</h1>
          <p style={styles.subheading}>Fashion & Apparel</p>
          <div style={styles.imageWrapper}>
            <img src={fashionImg} alt="Fashion Illustration" style={styles.image} />
          </div>
        </div>
      </div>

      {/* Right Login Section */}
      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={{ textAlign: 'center', color: '#007bff' }}>Customer Login</h2>
          <form onSubmit={handleSubmit}>
            {error && <div style={styles.errorBox}>{error}</div>}

            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <div style={styles.inputGroup}>
                <span style={styles.icon}><i className="fas fa-envelope"></i></span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter email"
                  style={styles.input}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputGroup}>
                <span style={styles.icon}><i className="fas fa-lock"></i></span>
                <input
                  type="password"
                  placeholder="Enter password"
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <button type="submit" style={styles.button}>
                <i className="fas fa-sign-in-alt" style={{ marginRight: '8px' }}></i>Login
              </button>
            </div>
          </form>
          <p style={styles.registerText}>
            Don't have an account? <a href="/customer-register">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f8f9fa',
  },
  left: {
    flex: 1,
    background: 'linear-gradient(to bottom right, #e0bbff, #d1c4e9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    color: '#333',
    padding: '2rem',
    textAlign: 'center',
  },
  branding: {
    width: '100%',
    maxWidth: '400px',
  },
  heading: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  subheading: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#555',
  },
  imageWrapper: {
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '1.5rem',
    transition: 'transform 0.3s ease',
  },
  image: {
    width: '100%',
    maxWidth: '300px',
    borderRadius: '12px',
  },
  right: {
    flex: 1,
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
  },
  errorBox: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '500',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: '5px',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  icon: {
    padding: '10px',
    backgroundColor: '#e9ecef',
    borderRight: '1px solid #ccc',
    color: '#6c757d',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: 'none',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  registerText: {
    marginTop: '20px',
    textAlign: 'center',
    color: '#6c757d',
  },
};
