// frontend/src/InventoryMaterialManager/InventoryMaterial.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InventoryMaterial.css';

const InventoryMaterial = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [formData, setFormData] = useState({
    Inventory_ID: '',
    Material_Name: '',
    Supplier_ID: '',
    Stock_Quantity: '',
    Unit_Price: '',
    Reorder_Level: '',
    Quality_status: '',
  });
  const [editItemId, setEditItemId] = useState(null);

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      const response = await axios.get('http://localhost:3001/inventorys');
      setInventoryItems(response.data.data);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItemId) {
        await axios.put('http://localhost:3001/inventorys_update', {
          id: editItemId,
          ...formData,
        });
        setEditItemId(null);
      } else {
        await axios.post('http://localhost:3001/inventorys_create', formData);
      }
      fetchInventoryItems();
      setFormData({
        Inventory_ID: '',
        Material_Name: '',
        Supplier_ID: '',
        Stock_Quantity: '',
        Unit_Price: '',
        Reorder_Level: '',
        Quality_status: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/inventorys_delete/${id}`);
      fetchInventoryItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditItemId(item._id);
    setFormData({
      Inventory_ID: item.Inventory_ID,
      Material_Name: item.Material_Name,
      Supplier_ID: item.Supplier_ID,
      Stock_Quantity: item.Stock_Quantity,
      Unit_Price: item.Unit_Price,
      Reorder_Level: item.Reorder_Level,
      Quality_status: item.Quality_status,
    });
  };

  return (
    <div className="inventory-container">
      <h2>Inventory Material Management</h2>
      <form onSubmit={handleSubmit} className="inventory-form">
        <input
          type="text"
          name="Inventory_ID"
          placeholder="Inventory ID"
          value={formData.Inventory_ID}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="Material_Name"
          placeholder="Material Name"
          value={formData.Material_Name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="Supplier_ID"
          placeholder="Supplier ID"
          value={formData.Supplier_ID}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="Stock_Quantity"
          placeholder="Stock Quantity"
          value={formData.Stock_Quantity}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="Unit_Price"
          placeholder="Unit Price"
          value={formData.Unit_Price}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="Reorder_Level"
          placeholder="Reorder Level"
          value={formData.Reorder_Level}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="Quality_status"
          placeholder="Quality Status"
          value={formData.Quality_status}
          onChange={handleChange}
          required
        />
        <button type="submit">{editItemId ? 'Update' : 'Add'} Item</button>
      </form>

      <table className="inventory-table">
        <thead>
          <tr>
            <th>Inventory ID</th>
            <th>Material Name</th>
            <th>Supplier ID</th>
            <th>Stock Quantity</th>
            <th>Unit Price</th>
            <th>Reorder Level</th>
            <th>Quality Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventoryItems.map((item) => (
            <tr key={item._id}>
              <td>{item.Inventory_ID}</td>
              <td>{item.Material_Name}</td>
              <td>{item.Supplier_ID}</td>
              <td>{item.Stock_Quantity}</td>
              <td>{item.Unit_Price}</td>
              <td>{item.Reorder_Level}</td>
              <td>{item.Quality_status}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryMaterial;