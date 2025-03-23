import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './loging.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL2 } from '../TEST/Utils/config';


const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      //  validation
      if (!formData.username || !formData.password) {
        throw new Error('Please fill in all fields');
      }

      // Fetch admin data from database
      const orderResponse = await axios.get(`${BASE_URL2}/admin`);
      console.log('dAAAAA',orderResponse);
      const adminData = Array.isArray(orderResponse.data.data) ? orderResponse.data.data[0] : orderResponse.data.data[0]; 
    
      
      if (
        adminData.adminName === formData.username && 
        adminData.password === formData.password
      )

      {
        console.log('Login successful');
        // Store authentication token/info if your API provides it
        localStorage.setItem('isAuthenticated', 'true');
                                            
        // Navigate based on the position
        switch (adminData.position) {
          case 'ProductAndWorkoderManager':
            navigate('/sidebar');
            break;
          case 'SalesAndOderManager':
            navigate('/');
            break;
          case 'MachineAndEmployeeManager':
            navigate('/');
            break;
          case 'InventoryAndMetirialManager':
            navigate('/');
            break;
          default:
            navigate('/'); // Optional fallback page
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
    <div className='login-section  justify-content-center align-items-center ' >
      <div className="card p-4 shadow-lg" style={{ width: '400px', borderRadius: '15px' }}>
        {/* Logo and Title */}
        <div className="text-center mb-4">
          <h3 className="d-flex align-items-center justify-content-center">
            <span className="me-2">🏭</span>
            <span>FactoryPro</span>
          </h3>
          <h4 className="mt-2">Welcome Back</h4>
          <p className="text-muted">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
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

          {/* Password Field */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
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

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Remember Me and Forgot Password */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                disabled={isLoading}
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <a href="#" className="text-primary text-decoration-none">
              Forgot your password?
            </a>
          </div>

          {/* Sign In Button */}
          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
