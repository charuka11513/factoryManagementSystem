import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Alert,
} from "reactstrap";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaFilePdf, FaCogs, FaSave, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import PDFGenerator from "./pdfGenaretion.jsx";

const EmployeeManager = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    employee_Id: "",
    fullName: "",
    jobRole: "",
    shift: "",
    assignedMachineID: "",
    attendanceRecord: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/employee");
      setEmployees(response.data.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employees. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!newEmployee.employee_Id.trim()) {
      tempErrors.employee_Id = "Employee ID is required";
      isValid = false;
    }
    if (!newEmployee.fullName.trim()) {
      tempErrors.fullName = "Full name is required";
      isValid = false;
    }
    if (!newEmployee.jobRole.trim()) {
      tempErrors.jobRole = "Job role is required";
      isValid = false;
    }
    if (!newEmployee.shift.trim()) {
      tempErrors.shift = "Shift is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({
      ...newEmployee,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const employeeData = {
        ...newEmployee,
        _id: newEmployee.employee_Id,
      };
      await axios.post("http://localhost:3001/employee_create", employeeData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      await fetchEmployees();
      setShowForm(false);
      setNewEmployee({
        employee_Id: "",
        fullName: "",
        jobRole: "",
        shift: "",
        assignedMachineID: "",
        attendanceRecord: "",
      });
      toast.success("Employee added successfully!");
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error(`Failed to add employee. ${error.response?.data?.message || "Please try again."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:3001/employee_delete/${id}`);
      setEmployees(employees.filter((emp) => emp._id !== id));
      toast.success("Employee deleted successfully!");
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error(`Failed to delete employee. ${error.response?.data?.message || "Please try again."}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEmployee = (employee) => {
    setEditingEmployee({
      ...employee,
      employee_Id: employee.employee_Id || "",
      fullName: employee.fullName || "",
      jobRole: employee.jobRole || "",
      shift: employee.shift || "",
      assignedMachineID: employee.assignedMachineID || "",
      attendanceRecord: employee.attendanceRecord || "",
    });
    setShowForm(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const errors = validateUpdateForm();
    if (Object.keys(errors).length > 0) {
      toast.error("Please correct the errors before submitting.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.put(
        "http://localhost:3001/employee_update",
        { id: editingEmployee._id, ...editingEmployee },
        { headers: { "Content-Type": "application/json" } }
      );
      await fetchEmployees();
      setShowForm(false);
      setEditingEmployee(null);
      toast.success("Employee updated successfully!");
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateUpdateForm = () => {
    let tempErrors = {};

    if (!editingEmployee.fullName.trim()) {
      tempErrors.fullName = "Full name is required";
    }
    if (!editingEmployee.jobRole.trim()) {
      tempErrors.jobRole = "Job role is required";
    }
    if (!editingEmployee.shift.trim()) {
      tempErrors.shift = "Shift is required";
    }

    setErrors(tempErrors);
    return tempErrors;
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      (emp.fullName && emp.fullName.toLowerCase().includes(search.toLowerCase())) ||
      (emp.employee_Id && emp.employee_Id.toString().includes(search))
  );

  const toggleModal = () => {
    setShowForm(!showForm);
    if (showForm) {
      setEditingEmployee(null);
      setNewEmployee({
        employee_Id: "",
        fullName: "",
        jobRole: "",
        shift: "",
        assignedMachineID: "",
        attendanceRecord: "",
      });
      setErrors({});
    }
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col xs="12">
          <Card className="shadow-sm rounded">
            <CardHeader className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h2 className="mb-0">Employee Management</h2>
              <div className="d-flex gap-2">
                <PDFGenerator employees={employees} />
                <Button
                  color="info"
                  size="sm"
                  onClick={() => navigate("/machines-details")}
                  title="View machine details"
                >
                  <FaCogs className="me-1" /> Machine Details
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <Row className="mb-4 align-items-center">
                <Col xs="12" md="6" className="mb-2 mb-md-0">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaSearch />
                    </span>
                    <Input
                      type="text"
                      placeholder="Search by Employee Name or ID"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </Col>
                <Col xs="12" md="6" className="text-md-end">
                  <Button
                    color="primary"
                    onClick={toggleModal}
                    disabled={isLoading}
                  >
                    <FaPlus className="me-1" /> New Employee
                  </Button>
                </Col>
              </Row>

              <Modal isOpen={showForm} toggle={toggleModal} size="lg">
                <ModalHeader toggle={toggleModal} className="bg-light">
                  {editingEmployee ? "Update Employee" : "Add New Employee"}
                </ModalHeader>
                <ModalBody>
                  <Form onSubmit={editingEmployee ? handleUpdateSubmit : handleAddEmployee}>
                    <Row>
                      <Col xs="12" md="6">
                        <FormGroup>
                          <Label for="employee_Id">Employee ID*</Label>
                          <Input
                            type="text"
                            id="employee_Id"
                            name="employee_Id"
                            placeholder="Enter employee ID"
                            value={editingEmployee ? editingEmployee.employee_Id : newEmployee.employee_Id}
                            onChange={editingEmployee ? (e) => setEditingEmployee({ ...editingEmployee, employee_Id: e.target.value }) : handleInputChange}
                            invalid={!!errors.employee_Id}
                            disabled={isLoading || editingEmployee}
                          />
                          {errors.employee_Id && <div className="text-danger">{errors.employee_Id}</div>}
                        </FormGroup>
                      </Col>
                      <Col xs="12" md="6">
                        <FormGroup>
                          <Label for="fullName">Full Name*</Label>
                          <Input
                            type="text"
                            id="fullName"
                            name="fullName"
                            placeholder="Enter full name"
                            value={editingEmployee ? editingEmployee.fullName : newEmployee.fullName}
                            onChange={editingEmployee ? (e) => setEditingEmployee({ ...editingEmployee, fullName: e.target.value }) : handleInputChange}
                            invalid={!!errors.fullName}
                            disabled={isLoading}
                          />
                          {errors.fullName && <div className="text-danger">{errors.fullName}</div>}
                        </FormGroup>
                      </Col>
                      <Col xs="12" md="6">
                        <FormGroup>
                          <Label for="jobRole">Job Role*</Label>
                          <Input
                            type="text"
                            id="jobRole"
                            name="jobRole"
                            placeholder="Enter job role"
                            value={editingEmployee ? editingEmployee.jobRole : newEmployee.jobRole}
                            onChange={editingEmployee ? (e) => setEditingEmployee({ ...editingEmployee, jobRole: e.target.value }) : handleInputChange}
                            invalid={!!errors.jobRole}
                            disabled={isLoading}
                          />
                          {errors.jobRole && <div className="text-danger">{errors.jobRole}</div>}
                        </FormGroup>
                      </Col>
                      <Col xs="12" md="6">
                        <FormGroup>
                          <Label for="shift">Shift*</Label>
                          <Input
                            type="select"
                            id="shift"
                            name="shift"
                            value={editingEmployee ? editingEmployee.shift : newEmployee.shift}
                            onChange={editingEmployee ? (e) => setEditingEmployee({ ...editingEmployee, shift: e.target.value }) : handleInputChange}
                            invalid={!!errors.shift}
                            disabled={isLoading}
                          >
                            <option value="">Select shift</option>
                            <option value="Morning">Morning</option>
                            <option value="Afternoon">Afternoon</option>
                            <option value="Night">Night</option>
                            <option value="Day">Day</option>
                          </Input>
                          {errors.shift && <div className="text-danger">{errors.shift}</div>}
                        </FormGroup>
                      </Col>
                      <Col xs="12" md="6">
                        <FormGroup>
                          <Label for="assignedMachineID">Assigned Machine ID</Label>
                          <Input
                            type="text"
                            id="assignedMachineID"
                            name="assignedMachineID"
                            placeholder="Enter machine ID"
                            value={editingEmployee ? editingEmployee.assignedMachineID : newEmployee.assignedMachineID}
                            onChange={editingEmployee ? (e) => setEditingEmployee({ ...editingEmployee, assignedMachineID: e.target.value }) : handleInputChange}
                            disabled={isLoading}
                          />
                        </FormGroup>
                      </Col>
                      <Col xs="12" md="6">
                        <FormGroup>
                          <Label for="attendanceRecord">Attendance Record</Label>
                          <Input
                            type="select"
                            id="attendanceRecord"
                            name="attendanceRecord"
                            value={editingEmployee ? editingEmployee.attendanceRecord : newEmployee.attendanceRecord}
                            onChange={editingEmployee ? (e) => setEditingEmployee({ ...editingEmployee, attendanceRecord: e.target.value }) : handleInputChange}
                            disabled={isLoading}
                          >
                            <option value="">Select attendance</option>
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                    <ModalFooter className="bg-light">
                      <Button
                        color="primary"
                        type="submit"
                        disabled={isLoading}
                      >
                        <FaSave className="me-1" /> {isLoading ? "Saving..." : editingEmployee ? "Update Employee" : "Save Employee"}
                      </Button>
                      <Button
                        color="secondary"
                        onClick={toggleModal}
                        disabled={isLoading}
                      >
                        <FaTimes className="me-1" /> Cancel
                      </Button>
                    </ModalFooter>
                  </Form>
                </ModalBody>
              </Modal>

              {isLoading ? (
                <div className="text-center py-5">
                  <Spinner color="primary" />
                  <p className="mt-2">Loading employees...</p>
                </div>
              ) : filteredEmployees.length === 0 ? (
                <Alert color="info" className="text-center">
                  {employees.length === 0
                    ? "No employees found. Add a new employee to get started."
                    : "No matching employees found for your search."}
                </Alert>
              ) : (
                <Table striped bordered hover responsive>
                  <thead className="bg-primary text-white">
                    <tr>
                      <th>Employee ID</th>
                      <th>Full Name</th>
                      <th>Job Role</th>
                      <th>Shift</th>
                      <th>Assigned Machine</th>
                      <th>Attendance</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((emp) => (
                      <tr key={emp._id}>
                        <td>{emp.employee_Id || "N/A"}</td>
                        <td>{emp.fullName || "N/A"}</td>
                        <td>{emp.jobRole || "N/A"}</td>
                        <td>{emp.shift || "N/A"}</td>
                        <td>{emp.assignedMachineID || "N/A"}</td>
                        <td>{emp.attendanceRecord || "N/A"}</td>
                        <td>
                          <Button
                            color="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleUpdateEmployee(emp)}
                            disabled={isLoading}
                            title="Update employee"
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => handleDeleteEmployee(emp._id)}
                            disabled={isLoading}
                            title="Delete employee"
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
};

export default EmployeeManager;