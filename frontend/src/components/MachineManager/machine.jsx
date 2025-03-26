import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./machine.css";

const MachineManager = () => {
  const [machines, setMachines] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
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


  const handleAddMachine = async () => {
    try {
      const response = await axios.post("http://localhost:3001/machine-create", newMachine);
      setMachines([...machines, response.data.data]);
      setShowForm(false);
      setNewMachine({
        machine_Id: "",
        machine_name: "",
        model: "",
        assigned_workOrder_ID: "",
        last_maintenance_date: "",
        machine_status: "",
      });
    } catch (error) {
      console.error("Error adding machine:", error);
    }
  };

  const handleDeleteMachine = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/machine-delete/${id}`);
      setMachines(machines.filter(machine => machine.machine_Id !== id));
    } catch (error) {
      console.error("Error deleting machine:", error);
    }
  };

  const handleUpdateMachine = (id) => {
    const machineToUpdate = machines.find(machine => machine.machine_Id === id);
    setNewMachine(machineToUpdate);
    setShowForm(true);
  };

  const handleViewWorkOrder = (workOrderId) => {
    // Implement work order details view functionality
    console.log("View work order:", workOrderId);
    alert(`Viewing Work Order: ${workOrderId}`);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Machine List", 20, 10);
    doc.autoTable({
      head: [
        ["Machine ID", "Machine Name", "Model", "Work Order ID", "Last Maintenance", "Status"]
      ],
      body: machines.map(machine => [
        machine.machine_Id,
        machine.machine_name,
        machine.model,
        machine.assigned_workOrder_ID,
        new Date(machine.last_maintenance_date).toLocaleDateString(),
        machine.machine_status,
      ]),
    });
    doc.save("machines.pdf");
  };

  return (
    <div className="container">
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
            <h2>{newMachine.machine_Id ? "Update Machine" : "Add New Machine"}</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Machine ID</label>
                <input 
                  type="text" 
                  value={newMachine.machine_Id} 
                  onChange={(e) => setNewMachine({ ...newMachine, machine_Id: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Machine Name</label>
                <input 
                  type="text" 
                  value={newMachine.machine_name} 
                  onChange={(e) => setNewMachine({ ...newMachine, machine_name: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Model</label>
                <input 
                  type="text" 
                  value={newMachine.model} 
                  onChange={(e) => setNewMachine({ ...newMachine, model: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Assigned Work Order ID</label>
                <input 
                  type="text" 
                  value={newMachine.assigned_workOrder_ID} 
                  onChange={(e) => setNewMachine({ ...newMachine, assigned_workOrder_ID: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Last Maintenance Date</label>
                <input 
                  type="date" 
                  value={newMachine.last_maintenance_date} 
                  onChange={(e) => setNewMachine({ ...newMachine, last_maintenance_date: e.target.value })} 
                />
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
              </div>
            </div>
            <div className="form-actions">
              <button className="cancel-btn" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button className="add-btn" onClick={handleAddMachine}>
                {newMachine.machine_Id ? "Update Machine" : "Add Machine"}
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
                <tr key={machine.machine_Id}>
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
                        onClick={() => handleUpdateMachine(machine.machine_Id)}
                      >
                        <svg className="icon" viewBox="0 0 24 24">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeleteMachine(machine.machine_Id)}
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