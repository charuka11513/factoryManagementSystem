import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./machine.css";



const MachineManager = () => {
  const [machines, setMachines] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [newMachine, setNewMachine] = useState({
    machine_Id: "",
    machine_name: "",
    model: "",
    assigned_workOrder_ID: "",
    last_maintenance_date: "",
    machine_status: "",
  });

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      const response = await axios.get("http://localhost:3001/machine");
      setMachines(response.data.data);
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!newMachine.machine_Id.trim()) {
      newErrors.machine_Id = "Machine ID is required";
    }
    if (!newMachine.machine_name.trim()) {
      newErrors.machine_name = "Machine Name is required";
    }
    if (!newMachine.model.trim()) {
      newErrors.model = "Model is required";
    }
    if (!newMachine.assigned_workOrder_ID.trim()) {
      newErrors.assigned_workOrder_ID = "Work Order ID is required";
    }
    if (!newMachine.last_maintenance_date) {
      newErrors.last_maintenance_date = "Maintenance date is required";
    }
    if (!newMachine.machine_status) {
      newErrors.machine_status = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddMachine = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if ('_id' in newMachine && newMachine._id) {
        // Update existing machine
        const response = await axios.put("http://localhost:3001/machine_update", {
          id: newMachine._id,
          ...newMachine
        });
        setMachines(machines.map(m => m._id === newMachine._id ? { ...m, ...newMachine } : m));
      } else {
        // Create new machine (without _id)
        const machineData = { ...newMachine };
        delete machineData._id; // Remove _id for new machines
        const response = await axios.post("http://localhost:3001/machine_create", machineData);
        setMachines([...machines, response.data.data || newMachine]);
      }
      setShowForm(false);
      setNewMachine({
        machine_Id: "",
        machine_name: "",
        model: "",
        assigned_workOrder_ID: "",
        last_maintenance_date: "",
        machine_status: "",
      });
      setErrors({});
      fetchMachines();
    } catch (error) {
      console.error("Error saving machine:", error);
      setErrors({ submit: "Failed to save machine. Please try again." });
    }
  };

  const handleDeleteMachine = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/machine_delete/${id}`);
      setMachines(machines.filter(machine => machine._id !== id));
    } catch (error) {
      console.error("Error deleting machine:", error);
    }
  };

  const handleUpdateMachine = (id) => {
    const machineToUpdate = machines.find(machine => machine._id === id);
    const formattedDate = machineToUpdate.last_maintenance_date 
      ? new Date(machineToUpdate.last_maintenance_date).toISOString().split('T')[0] 
      : '';
    
    setNewMachine({
      _id: machineToUpdate._id,
      machine_Id: machineToUpdate.machine_Id,
      machine_name: machineToUpdate.machine_name,
      model: machineToUpdate.model,
      assigned_workOrder_ID: machineToUpdate.assigned_workOrder_ID,
      last_maintenance_date: formattedDate,
      machine_status: machineToUpdate.machine_status
    });
    setShowForm(true);
    setErrors({});
  };

  const handleViewWorkOrder = (workOrderId) => {
    console.log("View work order:", workOrderId);
    alert(`Viewing Work Order: ${workOrderId}`);
  };


  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Add title
    doc.setFontSize(16);
    doc.text("Machine List", 20, 10);
  
    // Sample data (replace with your actual `machines` array)
    const machines = [
      { machine_Id: "M001", machine_name: "Drill Press", model: "DP-500", assigned_workOrder_ID: "WO123", last_maintenance_date: "2024-01-15", machine_status: "Operational" },
      { machine_Id: "M002", machine_name: "CNC Lathe", model: "CL-200", assigned_workOrder_ID: "WO124", last_maintenance_date: "2023-11-20", machine_status: "Maintenance Required" },
      { machine_Id: "M003", machine_name: "Milling Machine", model: "MM-300", assigned_workOrder_ID: null, last_maintenance_date: "2024-03-01", machine_status: "Operational" }
    ];
  
    // Prepare data
    const data = machines.map(machine => ({
      machine_Id: machine.machine_Id || "N/A",
      machine_name: machine.machine_name || "Unknown",
      model: machine.model || "N/A",
      assigned_workOrder_ID: machine.assigned_workOrder_ID || "None",
      last_maintenance_date: machine.last_maintenance_date ? new Date(machine.last_maintenance_date).toLocaleDateString() : "N/A",
      machine_status: machine.machine_status || "Unknown"
    }));
  
    // Define columns and their positions
    const columns = [
      { header: "Machine ID", width: 10 },
      { header: "Machine Name", width: 25 },
      { header: "Model", width: 30 },
      { header: "Work Order ID", width: 30 },
      { header: "Last Maintenance", width: 35 },
      { header: "Status", width: 44 }
    ];
  
    const startX = 20;
    let startY = 20;
  
    // Draw header row
    doc.setFontSize(12);
    columns.forEach((col, index) => {
      doc.text(col.header, startX + col.width * index, startY);
    });
  
    // Draw separator line after header
    startY += 5;
    doc.line(startX, startY, startX + columns.reduce((sum, col) => sum + col.width, 0), startY);
  
    // Draw data rows
    startY += 10;
    data.forEach(row => {
      columns.forEach((col, index) => {
        const textValue = String(row[col.header.toLowerCase().replace(/ /g, "_")] || "N/A"); // Convert to string to avoid errors
        doc.text(textValue, startX + col.width * index, startY);
      });
      startY += 10;
    });
  
    // Add calculation section
    startY += 10; // Space before calculations
    doc.setFontSize(14);
    doc.text("Summary Statistics", startX, startY);
  
    // Calculate statistics
    const totalMachines = machines.length;
    const operationalCount = machines.filter(m => m.machine_status === "Operational").length;
    const maintenanceDueCount = machines.filter(m => {
      if (!m.last_maintenance_date) return false;
      const lastMaintenance = new Date(m.last_maintenance_date);
      const daysSinceMaintenance = (new Date() - lastMaintenance) / (1000 * 60 * 60 * 24);
      return daysSinceMaintenance > 90; // Example: maintenance overdue after 90 days
    }).length;
  
    // Draw summary
    startY += 10;
    doc.setFontSize(12);
    doc.text(`Total Machines: ${totalMachines}`, startX, startY);
    startY += 10;
    doc.text(`Operational Machines: ${operationalCount}`, startX, startY);
    startY += 10;
    doc.text(`Machines Overdue for Maintenance: ${maintenanceDueCount}`, startX, startY);
  
    // Save the PDF
    doc.save("machines.pdf");
  };
  
  
 
  
  return (
    <div className="container wh-100">
      <h1 className="page-title">Machine Management</h1>
      <div className="search-container">
        <div className="search-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            type="text"
            placeholder="Search by Machine Name, Machine ID"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="new-machine-btn" onClick={() => setShowForm(true)}>
          <svg className="plus-icon" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Add Machine
        </button>
      </div>

      {showForm && (
        <div className="machine-form-overlay">
          <div className="machine-form-container">
            <h2>{'_id' in newMachine && newMachine._id ? "Update Machine" : "Add New Machine"}</h2>
            {errors.submit && <div className="error-message">{errors.submit}</div>}
            <div className="form-grid">
              <div className="form-group">
                <label>Machine ID</label>
                <input 
                  type="text" 
                  value={newMachine.machine_Id} 
                  onChange={(e) => setNewMachine({ ...newMachine, machine_Id: e.target.value })} 
                />
                {errors.machine_Id && <span className="error">{errors.machine_Id}</span>}
              </div>
              <div className="form-group">
                <label>Machine Name</label>
                <input 
                  type="text" 
                  value={newMachine.machine_name} 
                  onChange={(e) => setNewMachine({ ...newMachine, machine_name: e.target.value })} 
                />
                {errors.machine_name && <span className="error">{errors.machine_name}</span>}
              </div>
              <div className="form-group">
                <label>Model</label>
                <input 
                  type="text" 
                  value={newMachine.model} 
                  onChange={(e) => setNewMachine({ ...newMachine, model: e.target.value })} 
                />
                {errors.model && <span className="error">{errors.model}</span>}
              </div>
              <div className="form-group">
                <label>Assigned Work Order ID</label>
                <input 
                  type="text" 
                  value={newMachine.assigned_workOrder_ID} 
                  onChange={(e) => setNewMachine({ ...newMachine, assigned_workOrder_ID: e.target.value })} 
                />
                {errors.assigned_workOrder_ID && <span className="error">{errors.assigned_workOrder_ID}</span>}
              </div>
              <div className="form-group">
                <label>Last Maintenance Date</label>
                <input 
                  type="date" 
                  value={newMachine.last_maintenance_date} 
                  onChange={(e) => setNewMachine({ ...newMachine, last_maintenance_date: e.target.value })} 
                />
                {errors.last_maintenance_date && <span className="error">{errors.last_maintenance_date}</span>}
              </div>
              <div className="form-group">
                <label>Machine Status</label>
                <select 
                  value={newMachine.machine_status} 
                  onChange={(e) => setNewMachine({ ...newMachine, machine_status: e.target.value })}
                >
                  <option value="">Select Status</option>
                  <option value="Operational">Operational</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Out of Service">Out of Service</option>
                </select>
                {errors.machine_status && <span className="error">{errors.machine_status}</span>}
              </div>
            </div>
            <div className="form-actions">
              <button className="cancel-btn" onClick={() => {
                setShowForm(false);
                setErrors({});
              }}>
                Cancel
              </button>
              <button className="add-btn" onClick={handleAddMachine}>
                {'_id' in newMachine && newMachine._id ? "Update Machine" : "Add Machine"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="machine-table">
          <thead>
            <tr>
              <th>Machine ID</th>
              <th>Machine Name</th>
              <th>Model</th>
              <th>Work Order ID</th>
              <th>Last Maintenance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {machines
              .filter((machine) =>
                machine.machine_name.toLowerCase().includes(search.toLowerCase()) ||
                machine.machine_Id.includes(search)
              )
              .map((machine) => (
                <tr key={machine._id}>
                  <td>{machine.machine_Id}</td>
                  <td>{machine.machine_name}</td>
                  <td>{machine.model}</td>
                  <td>
                    {machine.assigned_workOrder_ID && (
                      <button 
                        className="work-order-btn"
                        onClick={() => handleViewWorkOrder(machine.assigned_workOrder_ID)}
                      >
                        {machine.assigned_workOrder_ID}
                      </button>
                    )}
                  </td>
                  <td>{new Date(machine.last_maintenance_date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${machine.machine_status.toLowerCase().replace(' ', '-')}`}>
                      {machine.machine_status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="update-btn" 
                        onClick={() => handleUpdateMachine(machine._id)}
                      >
                        <svg className="icon" viewBox="0 0 24 24">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeleteMachine(machine._id)}
                      >
                        <svg className="icon" viewBox="0 0 24 24">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="footer-actions">
        <button className="generate-pdf-btn" onClick={generatePDF}>
          <svg className="pdf-icon" viewBox="0 0 24 24">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
          Generate PDF
        </button>
      </div>
      
    </div>
  );
};

export default MachineManager;