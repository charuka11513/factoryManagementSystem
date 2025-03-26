import React, { useState, useEffect } from 'react';
import { Table, Container, Alert, Spinner } from 'react-bootstrap';
import { BASE_URL2 } from '../TEST/Utils/config';

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('http://localhost:3001/SalesOrder', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Raw API response:', result); // Debug log

        if (!result.data || !Array.isArray(result.data)) {
          throw new Error('Invalid data format from API');
        }

        // Try to sort by date, fallback to unsorted if it fails
        let recentOrders;
        try {
          recentOrders = [...result.data]
            .sort((a, b) => {
              const dateA = new Date(a.Date);
              const dateB = new Date(b.Date);
              return dateB - dateA;
            })
            .slice(0, 10);
        } catch (sortError) {
          console.warn('Sorting failed, using unsorted data:', sortError);
          recentOrders = result.data.slice(0, 10);
        }

        console.log('Processed orders:', recentOrders); // Debug log
        setOrders(recentOrders);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading orders...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <h4>Error loading orders</h4>
          <p>{error}</p>
          <p>Please check the console for more details and ensure the API is running at http://localhost:3000/SalesOrder</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h1 className="mb-4 text-center">Recent Orders</h1>
      {orders.length === 0 ? (
        <Alert variant="warning">No orders found</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id || order.Order_ID}>
                <td>{order.Order_ID}</td>
                <td>{order.Customer_Name}</td>
                <td>{order.Product_Ordered}</td>
                <td>{order.Quantity}</td>
                <td>{order.Date ? new Date(order.Date).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default RecentOrders;