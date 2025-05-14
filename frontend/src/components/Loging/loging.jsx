import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './loging.css'; // Custom CSS for the updated design
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL2 } from '../TEST/Utils/config';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!formData.username || !formData.password) {
        throw new Error('Please fill in all fields');
      }

      // Fetch all admin data
      const orderResponse = await axios.get(`${BASE_URL2}/admin`);
      console.log('Fetched Admin Data:', orderResponse.data);

      // Check if the response is an array
      const adminData = Array.isArray(orderResponse.data.data)
        ? orderResponse.data.data
        : [orderResponse.data.data];  // If the response is a single admin, convert it into an array

      // Find the admin who matches the username and password
      const matchedAdmin = adminData.find(
        (admin) => admin.adminName === formData.username && admin.password === formData.password
      );

      if (matchedAdmin) {
        console.log('Login successful');
        localStorage.setItem('isAuthenticated', 'true');

        // Navigate based on position
        switch (matchedAdmin.position) {
          case 'ProductAndWorkoderManager':
            navigate('/sidebar');
            break;
          case 'SalesAndOderManager':
            navigate('/SalesOrder-details');
            break;
          case 'MachineAndEmployeeManager':
            navigate('/employees-details');
            break;
          case 'InventoryAndMetirialManager':
            navigate('/inventory-details');
            break;
          default:
            navigate('/');
            break;
        }
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container d-flex">
      {/* Left Section - Image with Overlay Text */}
      <div className="left-section">
        <div className="overlay d-flex flex-column justify-content-center align-items-center text-white">
          <h1 className="welcome-text animate__fadeIn">Welcome to FactoryPro</h1>
          <h3 className="admin-text animate__fadeIn"> Logging</h3>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="right-section d-flex justify-content-center align-items-center p-5">
        <div className="login-card card p-4 shadow-lg animate__fadeIn">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-person"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="alert alert-danger animate__shakeX" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-100 animate__pulse"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
