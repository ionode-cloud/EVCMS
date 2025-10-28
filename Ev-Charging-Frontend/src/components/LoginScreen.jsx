import React, { useState } from 'react';
import '../App.css';

const LoginScreen = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    vehicle: '',
    mobile: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.vehicle) return;
    onLogin(formData); 
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '60px auto', padding: '30px' }}>
      <h2 className="page-title">Login</h2>
      <p style={{ color: 'var(--color-text-medium)', marginBottom: '20px' }}>
        Enter your details to continue
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Name</label>
          <input
            type="text"
            name="name"
            className="input-field"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Vehicle Number</label>
          <input
            type="text"
            name="vehicle"
            className="input-field"
            placeholder="Enter vehicle number"
            value={formData.vehicle}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Mobile Number</label>
          <input
            type="tel"
            name="mobile"
            className="input-field"
            placeholder="Enter mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            minLength="10"
            maxLength="10"
          />
        </div>

        <button type="submit" className="button-primary" style={{ width: '100%', marginTop: '15px' }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;
