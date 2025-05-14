import React, { useContext, useState, useEffect } from 'react';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFileExport, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import CusSwal from '../TEST/Utils/CustomSwal/CusSwal';
import { BASE_URL2 } from '../TEST/Utils/config';
import { ToastContainer } from 'react-toastify';
import { message } from 'antd';
import PdfGenerator from '../TEST/Utils/Pdfs/SupplierPDF';
import { AuthContext } from '../TEST/context/AuthContext.jsx';
import WorkOrderPDFHandler from '../TEST/Utils/Pdfs/WorkOrderPDFHandler.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const WorkOrders = () => {
  const [inventory, setInventory] = useState([]);
  const [filtereDatails, setFiltereDatails] = useState([]);
  const [modal, setModal] = useState(false);
  const [currentWorkOrder, setCurrentWorkOrder] = useState({
    work_order_Id: '',
    product: '',
    quentity: '',
    machine: '',
    deadline_date: '',
    order_status: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const pdfHandler = WorkOrderPDFHandler({ workOrders: filtereDatails });
  // *** Added: State for storing Order_IDs from SalesOrder ***
const [orderIds, setOrderIds] = useState([]);
const [machineNames, setMachineNames] = useState([]);


  useEffect(() => {
    fetchInventory();
    fetchOrderIds(); // Fetch Order_IDs
    fetchMachineNames();
    
  }, []);

  // Search
  useEffect(() => {
    if (Array.isArray(inventory)) {
      setFiltereDatails(
        inventory.filter(W_oder =>
          Object.values(W_oder).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      );
    }
  }, [searchTerm, inventory]);

  const fetchInventory = async () => {
    try {
      const response = await axios.get(`${BASE_URL2}/WorkOder`);
      setInventory(response.data);
      setFiltereDatails(response.data);
      convObjToArry(response, setInventory);
    } catch (error) {
      toast.error('Failed to fetch WorkOder');
    }
  };

  // Convert object to array
  const convObjToArry = (response, setveriale) => {
    if (response && Array.isArray(response.data.data)) {
      setveriale(response.data.data);
    } else {
      setveriale([]);
    }
  };

  const toggle = () => setModal(!modal);

  const handleInputChange = (e) => {
    setCurrentWorkOrder({ ...currentWorkOrder, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    const formattedDate = date ? date.toISOString().split('T')[0] : '';
    setCurrentWorkOrder({ ...currentWorkOrder, deadline_date: formattedDate });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Create new WorkOder
  const handleAddWorkOder = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await axios.post(`${BASE_URL2}/WorkOder_create`, currentWorkOrder);
      fetchInventory();
      toggle();
      message.success("WorkOder added successfully");
    } catch (error) {
      toast.error('WorkOder Failed to create');
    }
  };

  // Update
  const handleUpdate = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      toast.error('Please correct the errors before submitting.');
      return;
    }

    try {
      await axios.put(`${BASE_URL2}/WorkOder_update`, { id: currentWorkOrder._id, ...currentWorkOrder });
      fetchInventory();
      toggle();
      toast.success("Updated successfully");
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  // Delete
  const handleDelete = async (id) => {
    CusSwal.deleteConfiramation(async () => {
      try {
        await axios.delete(`${BASE_URL2}/WorkOder_delete/${id}`);
        fetchInventory();
        message.success("Deleted successfully");
      } catch (error) {
        toast.error('Failed to delete');
      }
    });
  };

  // *** Added: Function to fetch Order_IDs from SalesOrder ***
const fetchOrderIds = async () => {
  try {
    const response = await axios.get('http://localhost:3001/SalesOrder');
    const orders = response.data.data || [];
    const ids = orders.map(order => order.Order_ID);
    setOrderIds(ids);
  } catch (error) {
    toast.error('Failed to fetch Order IDs');
  }
};

// *** Added: Function to fetch machine_name values ***
const fetchMachineNames = async () => {
  try {
    const response = await axios.get('http://localhost:3001/machine');
    const machines = response.data.data || [];
    const names = machines.map(machine => machine.machine_name);
    setMachineNames(names);
  } catch (error) {
    toast.error('Failed to fetch machine names');
  }
};

  const validate = () => {
    const newErrors = {};

    // Validate work order ID
    if (!currentWorkOrder.work_order_Id) {
      newErrors.work_order_Id = "Work order ID is required.";
    }

    // Validate product
    if (!currentWorkOrder.product) {
      newErrors.product = "Product is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(currentWorkOrder.product)) {
      newErrors.product = "Product must be a string and can't contain numbers or special characters.";
    }

    // Validate quantity
    if (
      !currentWorkOrder.quentity ||
      isNaN(currentWorkOrder.quentity) ||
      Number(currentWorkOrder.quentity) <= 50
    ) {
      newErrors.quentity = "Quantity must be a number greater than 50.";
    }
    

    // Validate deadline date
    if (!currentWorkOrder.deadline_date) {
      newErrors.deadline_date = "Deadline date is required.";
    } else if (new Date(currentWorkOrder.deadline_date) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.deadline_date = "Deadline date cannot be in the past.";
    }

    // Validate order_status
    if (!currentWorkOrder.order_status || !currentWorkOrder.order_status.trim()) {
      newErrors.order_status = "Order status is required.";
    }

    // Validate machine
    if (!currentWorkOrder.machine || !currentWorkOrder.machine.trim()) {
      newErrors.machine = "Machine is required.";
    }

    setValidationErrors(newErrors);
    return newErrors;
  };

  const openUpdateModal = (item) => {
    setCurrentWorkOrder({
      ...item,
      deadline_date: item.deadline_date ? new Date(item.deadline_date).toISOString().split('T')[0] : ''
    });
    setIsEditing(true);
    toggle();
  };

  // PDF generate
  const handleExportPDF = async () => {
    try {
      console.log('Data being sent to PDF:', filtereDatails);
      console.log('Stats:', pdfHandler.stats);
      await pdfHandler.generatePDF();
      toast.success('PDF generated successfully');
    } catch (error) {
      toast.error('Failed to generate PDF: ' + error.message);
      console.error('PDF generation error:', error);
    }
  };

  // Status changer
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${BASE_URL2}/WorkOder_update`, { id, order_status: newStatus });
      setInventory(prev =>
        prev.map(item =>
          item._id === id ? { ...item, order_status: newStatus } : item
        )
      );
      setFiltereDatails(prev =>
        prev.map(item =>
          item._id === id ? { ...item, order_status: newStatus } : item
        )
      );
      message.success("Status updated successfully");
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="container mt-5 ">
      <h2 className="mb-4">Work Order Details</h2>
      <div className="d-flex justify-content-between mb-3">
        <Button
          size='sm'
          className="btn btn-primary"
          onClick={() => { setIsEditing(false); setCurrentWorkOrder({}); toggle(); }}
        >
          <FaPlus /> Add New Work Order
        </Button>
        <div className="d-flex">
          <Input
            type="text"
            placeholder="Search Work Order..."
            value={searchTerm}
            onChange={handleSearch}
            className="mr-2"
          />
          <Button
            color="success"
            size='sm'
            onClick={handleExportPDF}
          >
            <FaFileExport /> Generate report
          </Button>
        </div>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Work Order ID</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Machine</th>
            <th>Deadline Date</th>
            <th>Status</th>
            <th>Processing Actions</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filtereDatails) && filtereDatails.length > 0 ? (
            filtereDatails.map((workOrderDetails) => (
              <tr key={workOrderDetails._id}>
                <td>{workOrderDetails.work_order_Id}</td>
                <td>{workOrderDetails.product}</td>
                <td>{workOrderDetails.quentity}</td>
                <td>{workOrderDetails.machine}</td>
                <td>{new Date(workOrderDetails.deadline_date).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`badge ${
                      workOrderDetails.order_status === 'Pending' ? 'bg-secondary' :
                      workOrderDetails.order_status === 'processing' ? 'bg-warning' :
                      workOrderDetails.order_status === 'Processed' ? 'bg-success' : ''
                    }`}
                  >
                    {workOrderDetails.order_status}
                  </span>
                </td>
                <td>
                  <Button
                    size="sm"
                    className={`btn mx-1 ${
                      workOrderDetails.order_status === 'Pending' ? '' : 'btn-outline'
                    }`}
                    style={{
                      backgroundColor: workOrderDetails.order_status === 'Pending' ? '#6c757d' : 'transparent',
                      borderColor: '#6c757d',
                      color: workOrderDetails.order_status === 'Pending' ? 'white' : '#6c757d'
                    }}
                    onClick={() => handleStatusChange(workOrderDetails._id, 'Pending')}
                  >
                    Pending
                  </Button>
                  <Button
                    size="sm"
                    className={`btn mx-1 ${
                      workOrderDetails.order_status === 'processing' ? '' : 'btn-outline'
                    }`}
                    style={{
                      backgroundColor: workOrderDetails.order_status === 'processing' ? '#17a2b8' : 'transparent',
                      borderColor: '#17a2b8',
                      color: workOrderDetails.order_status === 'processing' ? 'white' : '#17a2b8'
                    }}
                    onClick={() => handleStatusChange(workOrderDetails._id, 'processing')}
                  >
                    Processing
                  </Button>
                  <Button
                    size="sm"
                    className={`btn mx-1 ${
                      workOrderDetails.order_status === 'Processed' ? '' : 'btn-outline'
                    }`}
                    style={{
                      backgroundColor: workOrderDetails.order_status === 'Processed' ? '#28a745' : 'transparent',
                      borderColor: '#28a745',
                      color: workOrderDetails.order_status === 'Processed' ? 'white' : '#28a745'
                    }}
                    onClick={() => handleStatusChange(workOrderDetails._id, 'Processed')}
                  >
                    Processed
                  </Button>
                </td>
                <td>
                  <Button
                    size="sm"
                    className="btn mx-1"
                    style={{
                      backgroundColor: '#007bff',
                      borderColor: '#007bff',
                      color: 'white'
                    }}
                    onClick={() => openUpdateModal(workOrderDetails)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    size="sm"
                    className="btn mx-1 position-relative"
                    style={{
                      backgroundColor: '#dc3545',
                      borderColor: '#dc3545',
                      color: 'white'
                    }}
                    onClick={() => handleDelete(workOrderDetails._id)}
                  >
                    <FaTrash />
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">
                      X
                      <span className="visually-hidden">delete</span>
                    </span>
                  </Button>
                </td>
              </tr>
            ))
          ) : null}
        </tbody>
      </Table>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>{isEditing ? 'Update details' : 'Add New Work Order'}</ModalHeader>
        <ModalBody>
          <Form>
          <FormGroup>
              <Label for="work_order_Id">Work Order ID</Label>
              <Input
                type="select"
                name="work_order_Id"
                id="work_order_Id"
                value={currentWorkOrder.work_order_Id || ''}
                onChange={handleInputChange}
                invalid={!!validationErrors.work_order_Id}
              >
                <option value="">Select Order ID</option>
                {orderIds.map((orderId, index) => (
                  <option key={index} value={orderId}>{orderId}</option>
                ))}
              </Input>
              {validationErrors.work_order_Id && <div className="text-danger">{validationErrors.work_order_Id}</div>}
            </FormGroup>

{/* *** Modified: Changed machine input to dropdown *** */}
<FormGroup>
  <Label for="machine">Machine</Label>
  <Input
    type="select"
    name="machine"
    id="machine"
    value={currentWorkOrder.machine || ''}
    onChange={handleInputChange}
    invalid={!!validationErrors.machine}
  >
    <option value="">Select Machine</option>
    {machineNames.map((machineName, index) => (
      <option key={index} value={machineName}>{machineName}</option>
    ))}
  </Input>
  {validationErrors.machine && <div className="text-danger">{validationErrors.machine}</div>}
</FormGroup>

            <FormGroup>
              <Label for="product">Product</Label>
              <Input
                type="text"
                name="product"
                id="product"
                value={currentWorkOrder.product || ''}
                onChange={handleInputChange}
                invalid={!!validationErrors.product}/>
              
              {validationErrors.product && <div className="text-danger">{validationErrors.product}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="quentity">Quantity</Label>
              <Input
                type="text"
                name="quentity"
                id="quentity"
                value={currentWorkOrder.quentity || ''}
                onChange={handleInputChange}
                invalid={!!validationErrors.quentity}/>
              
              {validationErrors.quentity && <div className="text-danger">{validationErrors.quentity}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="deadline_date">Deadline Date</Label><br></br>
              <DatePicker
                selected={currentWorkOrder.deadline_date ? new Date(currentWorkOrder.deadline_date) : null}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                minDate={new Date()}
                className={`form-control ${validationErrors.deadline_date ? 'is-invalid' : ''}`}
                placeholderText="Select a date"
                id="deadline_date"/>
              
              {validationErrors.deadline_date && <div className="text-danger">{validationErrors.deadline_date}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="order_status">Production Status</Label>
              <div>
                <div className="form-check form-check-inline">
                  <Input
                    type="radio"
                    name="order_status"
                    id="processing"
                    value="processing"
                    checked={currentWorkOrder.order_status === "processing"}
                    onChange={handleInputChange}
                    invalid={!!validationErrors.order_status}
                    className="form-check-input"/>
                  
                  <Label for="processing" className="form-check-label">Processing</Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    type="radio"
                    name="order_status"
                    id="processed"
                    value="Processed"
                    checked={currentWorkOrder.order_status === "Processed"}
                    onChange={handleInputChange}
                    invalid={!!validationErrors.order_status}
                    className="form-check-input"/>
                  
                  <Label for="processed" className="form-check-label">Processed</Label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    type="radio"
                    name="order_status"
                    id="pending"
                    value="Pending"
                    checked={currentWorkOrder.order_status === "Pending"}
                    onChange={handleInputChange}
                    invalid={!!validationErrors.order_status}
                    className="form-check-input"/>
                  
                  <Label for="pending" className="form-check-label">Pending</Label>
                </div>
              </div>
              {validationErrors.order_status && <div className="text-danger">{validationErrors.order_status}</div>}
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={isEditing ? handleUpdate : handleAddWorkOder}>
            {isEditing ? 'Update' : 'Add'}
          </Button>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default WorkOrders;