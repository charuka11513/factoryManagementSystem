// AdminManager.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Container, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BASE_URL2 } from '../TEST/Utils/config';

const AdminManager = () => {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    adminName: '',
    position: '',
    password: ''
  });
  const [updateId, setUpdateId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL2}/admin`);
      setAdmins(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${BASE_URL2}/admin_create`, formData);
      setFormData({ adminName: '', position: '', password: '' });
      fetchAdmins();
      setError(null);
    } catch (err) {
      setError('Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put(`${BASE_URL2}/admin_update`, {
        id: updateId,
        ...formData
      });
      setFormData({ adminName: '', position: '', password: '' });
      setUpdateId(null);
      fetchAdmins();
      setError(null);
    } catch (err) {
      setError('Failed to update admin');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${BASE_URL2}/admin_delete/${id}`);
      fetchAdmins();
      setError(null);
    } catch (err) {
      setError('Failed to delete admin');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (admin) => {
    setUpdateId(admin._id);
    setFormData({
      adminName: admin.adminName,
      position: admin.position,
      password: admin.password
    });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Admin Management</h2>

      {/* Admin Form */}
      <Form onSubmit={updateId ? handleUpdate : handleCreate} className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Admin Name</Form.Label>
          <Form.Control
            type="text"
            name="adminName"
            value={formData.adminName}
            onChange={handleChange}
            placeholder="Enter admin name"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label>Position</Form.Label>
            <Form.Control
                as="select"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
            >
                <option value="">Select a position</option>
                <option value="ProductAndWorkoderManager">ProductAndWorkoderManager</option>
                <option value="SalesAndOderManager">SalesAndOderManager</option>
                <option value="InventoryAndMetirialManager">InventoryAndMetirialManager</option>
                <option value="MachineAndEmployeeManager">MachineAndEmployeeManager</option>
            </Form.Control>
            </Form.Group>


        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <div className="password-wrapper">
            <Form.Control
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
            <Button
              type="button"
              variant="link"
              className="password-toggle-btn"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? 'Hide' : 'Show'}
            </Button>
          </div>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <Spinner animation="border" size="sm" />
          ) : updateId ? 'Update Admin' : 'Add Admin'}
        </Button>

        {updateId && (
          <Button
            variant="secondary"
            className="ms-2"
            onClick={() => {
              setUpdateId(null);
              setFormData({ adminName: '', position: '', password: '' });
            }}
          >
            Cancel Update
          </Button>
        )}
      </Form>

      {/* Error Message */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Admin List */}
      <div>
        <h3>Admin List</h3>
        {loading && (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        )}
        {!loading && admins.length === 0 && <p>No admins found</p>}
        {!loading && admins.length > 0 && (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin._id}>
                  <td>{admin.adminName}</td>
                  <td>{admin.position}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(admin)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(admin._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </Container>
  );
};

export default AdminManager;
