import React, {useContext, useState, useEffect } from 'react'; 
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFileExport, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import CusSwal from '../TEST/Utils/CustomSwal/CusSwal';
import { BASE_URL2 } from '../TEST/Utils/config';
import { ToastContainer } from 'react-toastify';
import {message} from 'antd'
import PdfGenerator from '../TEST/Utils/Pdfs/SupplierPDF';
import { AuthContext } from '../TEST/context/AuthContext.jsx'; 
import WorkOrderPDFHandler from '../TEST/Utils/Pdfs/WorkOrderPDFHandler.jsx';

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
  useEffect(() => {
    fetchInventory();
  }, []);

  //search
  useEffect(() => {
    if (Array.isArray(inventory)) {
    setFiltereDatails(
      inventory.filter(W_oder =>
        Object.values(W_oder).some(value =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );}
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

  //convert to object to variable
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  //create new WorkOder
  const handleAddWorkOder = async () => {
    const errors = validate(); 
    console.log("currentWorkOrder",currentWorkOrder); // Log to check the values being validated
    console.log("errors",errors); // Log to see the errors found
    if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
    }

    try {
      await axios.post(`${BASE_URL2}/WorkOder_create`, currentWorkOrder);
      fetchInventory();
      toggle();
      message.success("WorkOder added successfully")
    } catch (error) {
      toast.error('WorkOder Failed to create');
    }
  };

  //update
  const handleUpdate = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) {
        toast.error('Please correct the errors before submitting.');
        return;}
    
    try {
      await axios.put(`${BASE_URL2}/WorkOder_update`, { id: currentWorkOrder._id, ...currentWorkOrder });
      fetchInventory();
      toggle();
      toast.success("updated successfully");
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  //delete
  const handleDelete = async (id) => {
    CusSwal.deleteConfiramation(async () => {
      try {
        await axios.delete(`${BASE_URL2}/WorkOder_delete/${id}`);
        fetchInventory();
        message.success(" deleted successfully")
      } catch (error) {
        toast.error('Failed to delete ');
      }
    });
   };

   const validate = () => {
      const newErrors = {};
    
      
      // Validate work order ID
        if (!currentWorkOrder.work_order_Id) {
          newErrors.work_order_Id = "Work order ID is required."; }
       

    
      // Validate product
      if (!currentWorkOrder.product) {
        newErrors.product = "Product is required.";
      } else if (!/^[a-zA-Z\s]+$/.test(currentWorkOrder.product)) {
        newErrors.product = "Product must be a string and can't contain numbers or special characters.";}

      // Validate quantity
      if (!currentWorkOrder.quentity || currentWorkOrder.quentity <= 50) {
        newErrors.quentity = "Quantity must be greater than 50.";}

      // Validate deadline date
      if (!currentWorkOrder.deadline_date) {
        newErrors.deadline_date = "Deadline date is required.";
      } else if (new Date(currentWorkOrder.deadline_date) < new Date()) {
        newErrors.deadline_date = "Deadline date cannot be in the past."; }
    
      // Validate order_status
      if (!currentWorkOrder.order_status || !currentWorkOrder.order_status.trim()) { 
        newErrors.order_status = "order_status is required.";}
    
      // Validate machine
      if (!currentWorkOrder.machine || !currentWorkOrder.machine.trim()) {
        newErrors.machine = "machine is required.";}
    
      setValidationErrors(newErrors);
      return newErrors;
    };
  
  const openUpdateModal = (item) => {
    setCurrentWorkOrder(item);
    setIsEditing(true);
    toggle();
  };

  //pdf generate
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
  //status changer 
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
  ////////////////////////////////////////////////////email//////////////////////////////////////////////


  return (
    <div className="container mt-5">
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
              <Label for="name">Work Order ID</Label>
              <Input type="text" name="work_order_Id" id="name" value={currentWorkOrder.work_order_Id || ''} onChange={handleInputChange} 
              invalid={!!validationErrors.work_order_Id} />
              {validationErrors.work_order_Id && <div className="text-danger">{validationErrors.work_order_Id}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="machine">machine</Label>
              <Input type="text"name="machine"id="machine"value={currentWorkOrder.machine || ''} onChange={handleInputChange}
                invalid={!!validationErrors.machine}/>
                {validationErrors.machine && <div className="text-danger">{validationErrors.machine}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="product">Product</Label>
              <Input type="text"name="product"id="product"value={currentWorkOrder.product || ''} onChange={handleInputChange}
                invalid={!!validationErrors.product}/>
                {validationErrors.product && <div className="text-danger">{validationErrors.product}</div>}
            </FormGroup>


            <FormGroup>
              <Label for="name">Quantity</Label>
              <Input type="text" name="quentity" id="name" value={currentWorkOrder.quentity || ''} onChange={handleInputChange} 
              invalid={!!validationErrors.quentity} />
              {validationErrors.quentity && <div className="text-danger">{validationErrors.quentity}</div>}
            </FormGroup>

            <FormGroup>
              <Label for="name">deadline_date</Label>
              <Input type="text" name="deadline_date" id="name" value={currentWorkOrder.deadline_date || ''} onChange={handleInputChange} 
              invalid={!!validationErrors.deadline_date} />
              {validationErrors.deadline_date && <div className="text-danger">{validationErrors.deadline_date}</div>}
            </FormGroup>

            <FormGroup>
                    <Label for="order_status">Production Status</Label>
                    <div>
                      <div className="form-check form-check-inline">
                        <Input type="radio"name="order_status"id="processing"value="processing"
                          checked={currentWorkOrder.order_status === "processing"}
                          onChange={handleInputChange}
                          invalid={!!validationErrors.order_status}
                          className="form-check-input"/>
                          <Label for="processing" className="form-check-label">processing</Label>
                    </div>   

                      <div className="form-check form-check-inline">
                        <Input type="radio"name="order_status"id="processed"value="Processed"
                          checked={currentWorkOrder.order_status === "Processed"}
                          onChange={handleInputChange}
                          invalid={!!validationErrors.order_status}
                          className="form-check-input"/>
                         <Label for="processed" className="form-check-label">Processed</Label>
                      </div>
      
                      <div className="form-check form-check-inline">
                        <Input type="radio"name="order_status"id="pending"value="Pending"
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
