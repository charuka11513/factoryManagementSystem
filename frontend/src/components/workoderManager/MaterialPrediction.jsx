import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Card, Row, Col, Badge, Form, Spinner } from 'react-bootstrap';
import { FaCalculator, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL2 } from '../TEST/Utils/config';
import PdfGenerator from '../TEST/Utils/Pdfs/SupplierPDF';

const MaterialPrediction = () => {
  const [pendingPredictions, setPendingPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [singlePrediction, setSinglePrediction] = useState(null);
  const [calculatingPrediction, setCalculatingPrediction] = useState(false);

  useEffect(() => {
    fetchPendingPredictions();
  }, []);

  const fetchPendingPredictions = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL2}/production/predict-pending`);
      if (response.data && response.data.success) {
        setPendingPredictions(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch predictions');
      console.error('Error fetching predictions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    
    if (!productId || !quantity) {
      toast.warning('Please enter both Product ID and Quantity');
      return;
    }
    
    try {
      setCalculatingPrediction(true);
      const response = await axios.get(`${BASE_URL2}/production/predict/${productId}/${quantity}`);
      if (response.data && response.data.success) {
        setSinglePrediction(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to calculate prediction');
      console.error('Error calculating prediction:', error);
    } finally {
      setCalculatingPrediction(false);
    }
  };

  const generatePredictionReport = () => {
    if (!pendingPredictions.length) return;
    
    const headers = ['Work Order ID', 'Product', 'Quantity', 'Materials Cost', 'Labor Cost', 'Total Cost', 'Insufficient Materials'];
    
    // Map the prediction details into an array of data
    const data = pendingPredictions.map(prediction => [
      prediction.work_order_id,
      prediction.product.name,
      prediction.quantity_ordered,
      `$${prediction.total_cost.materials.toFixed(2)}`,
      `$${prediction.total_cost.labor.toFixed(2)}`,
      `$${prediction.total_cost.total.toFixed(2)}`,
      prediction.insufficient_materials.length > 0 ? 'Yes' : 'No'
    ]);
    
    const title = 'Production Materials and Cost Prediction';
    const generatedDate = new Date().toLocaleString();
    const numberOfItems = pendingPredictions.length;
    
    PdfGenerator.generatePdf(data, title, headers, numberOfItems, generatedDate);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Production Material and Cost Prediction</h2>
      
      {/* Single Prediction Calculator */}
      <Card className="mb-4">
        <Card.Header>
          <h4><FaCalculator className="me-2" /> Production Calculator</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleCalculate}>
            <Row>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Product ID</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder="Enter product ID" 
                  />
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter quantity" 
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button 
                  type="submit" 
                  className="w-100"
                  disabled={calculatingPrediction}
                >
                  {calculatingPrediction ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Calculating...
                    </>
                  ) : (
                    'Calculate'
                  )}
                </Button>
              </Col>
            </Row>
          </Form>

          {singlePrediction && (
            <div className="mt-4">
              <h5>Prediction Results for {singlePrediction.product.name}</h5>
              
              <Row className="mb-3 mt-3">
                <Col md={3}>
                  <Card className="text-center">
                    <Card.Body>
                      <h6>Material Cost</h6>
                      <h3>${singlePrediction.total_cost.materials.toFixed(2)}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center">
                    <Card.Body>
                      <h6>Labor Cost</h6>
                      <h3>${singlePrediction.total_cost.labor.toFixed(2)}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center">
                    <Card.Body>
                      <h6>Overhead Cost</h6>
                      <h3>${singlePrediction.total_cost.overhead.toFixed(2)}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center bg-primary text-white">
                    <Card.Body>
                      <h6>Total Cost</h6>
                      <h3>${singlePrediction.total_cost.total.toFixed(2)}</h3>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              <Table striped bordered hover className="mt-3">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Quantity Needed</th>
                    <th>Unit Price</th>
                    <th>Total Cost</th>
                    <th>Current Stock</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {singlePrediction.materials_needed.map((material, index) => (
                    <tr key={index}>
                      <td>{material.material_name}</td>
                      <td>{material.quantity_needed} {material.unit_of_measure}</td>
                      <td>${material.unit_price}</td>
                      <td>${material.total_cost}</td>
                      <td>{material.current_stock} {material.unit_of_measure}</td>
                      <td>
                        {material.has_sufficient_stock ? (
                          <Badge bg="success"><FaCheckCircle /> Sufficient</Badge>
                        ) : (
                          <Badge bg="danger"><FaExclamationTriangle /> Insufficient</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              <div className="text-muted mt-2">
                <strong>Production Time:</strong> Approximately {singlePrediction.production_time_days} days
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Pending Orders Predictions */}
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>Predictions for Pending Work Orders</h4>
          <Button 
            variant="success" 
            onClick={generatePredictionReport}
            disabled={pendingPredictions.length === 0}
          >
            Generate Report
          </Button>
        </Card.Header>
        <Card.Body>
          {isLoading ? (
            <div className="text-center my-5">
              <Spinner animation="border" />
              <p className="mt-2">Loading predictions...</p>
            </div>
          ) : pendingPredictions.length === 0 ? (
            <div className="text-center my-5">
              <p>No pending work orders to predict for.</p>
            </div>
          ) : (
            <Table responsive bordered hover>
              <thead>
                <tr>
                  <th>Work Order ID</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Materials Cost</th>
                  <th>Labor Cost</th>
                  <th>Total Cost</th>
                  <th>Production Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingPredictions.map((prediction, index) => (
                  <tr key={index}>
                    <td>{prediction.work_order_id}</td>
                    <td>{prediction.product.name}</td>
                    <td>{prediction.quantity_ordered}</td>
                    <td>${prediction.total_cost.materials.toFixed(2)}</td>
                    <td>${prediction.total_cost.labor.toFixed(2)}</td>
                    <td>${prediction.total_cost.total.toFixed(2)}</td>
                    <td>{prediction.production_time_days} days</td>
                    <td>
                      {prediction.insufficient_materials.length > 0 ? (
                        <Badge bg="warning">
                          <FaExclamationTriangle /> Missing Materials
                        </Badge>
                      ) : (
                        <Badge bg="success">
                          <FaCheckCircle /> Ready to Produce
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
      
      <ToastContainer />
    </div>
  );
};

export default MaterialPrediction;