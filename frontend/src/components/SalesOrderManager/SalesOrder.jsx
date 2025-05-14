import React, { useState, useEffect } from "react";
import {
  Table, Button, Input, Tag, Space, Modal, Form, InputNumber, Select, DatePicker,
  message, Popconfirm, Card, Row, Col, Tabs
} from "antd";
import {
  PlusOutlined, LineChartOutlined, BarChartOutlined, PieChartOutlined
} from "@ant-design/icons";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts";
import "./SalesOrder.css";

const { Option } = Select;
const { TabPane } = Tabs;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const SalesOrder = () => {
  // State management
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInventoryModalVisible, setIsInventoryModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [chartView, setChartView] = useState("monthly");
  const [form] = Form.useForm();
  const [inventoryForm] = Form.useForm();

  // Fetch orders and inventory on mount
  useEffect(() => {
    fetchOrders();
    fetchInventory();
  }, []);

  // Fetch sales orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3001/SalesOrder");
      const formattedOrders = (response.data.data || []).map(order => ({
        ...order,
        Date: order.Date ? moment(order.Date).format("YYYY-MM-DD") : "N/A",
      }));
      setOrders(formattedOrders);
      setFilteredOrders(formattedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Failed to fetch orders.");
    }
  };

  // Fetch inventory
  const fetchInventory = async () => {
    try {
      const response = await axios.get("http://localhost:3001/Inventory");
      setInventory(response.data.data || []);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      message.error("Failed to fetch inventory.");
    }
  };

  // Search functionality
  const handleSearch = (value) => {
    setSearchText(value);
    const filteredData = orders.filter(order =>
      order.Customer_Name.toLowerCase().includes(value.toLowerCase()) ||
      order.Order_ID.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOrders(filteredData);
  };

  // Tag rendering for status
  const getStatusTag = (status) => {
    const colors = {
      Pending: "gold",
      Paid: "green",
      Processing: "blue",
      Finished: "green",
      Delivered: "green",
      "Low Stock": "red",
      "In Stock": "green",
      "Out of Stock": "gray",
    };
    return <Tag color={colors[status] || "default"}>{status}</Tag>;
  };

  // Open modal for new order
  const handleNewOrder = () => {
    setEditingOrder(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Open modal for updating order
  const handleUpdate = (order) => {
    setEditingOrder(order);
    form.setFieldsValue({
      Customer_Name: order.Customer_Name,
      Product_Ordered: order.Product_Ordered,
      Quantity: order.Quantity,
      Date: order.Date ? moment(order.Date) : null,
      Total_Price: order.Total_Price,
      Payment_status: order.Payment_status,
      Delivery_status: order.Delivery_status,
    });
    setIsModalVisible(true);
  };

  // Submit order (create or update)
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const formattedDate = values.Date ? values.Date.format("YYYY-MM-DD") : null;

      if (editingOrder) {
        await axios.put("http://localhost:3001/SalesOrder_update", {
          id: editingOrder._id,
          ...values,
          Date: formattedDate,
        });
        message.success("Order Updated Successfully!");
      } else {
        const newOrder = {
          Order_ID: `ORD-${Date.now()}`,
          ...values,
          Date: formattedDate,
        };
        await axios.post("http://localhost:3001/SalesOrder_create", newOrder);
        message.success("Order Created Successfully!");
        updateInventoryOnOrder(values.Product_Ordered, values.Quantity);
      }

      setIsModalVisible(false);
      fetchOrders();
    } catch (error) {
      console.error("Error saving order:", error);
      message.error("Failed to save order.");
    }
  };

  // Delete order
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/SalesOrder_delete/${id}`);
      message.success("Order Deleted Successfully!");
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
      message.error("Failed to delete order.");
    }
  };

  // Update inventory when new order is created
  const updateInventoryOnOrder = async (productName, quantity) => {
    try {
      const product = inventory.find(item => item.Product_Name === productName);
      if (product) {
        const newQuantity = product.Quantity - quantity;
        const status = newQuantity <= 0 ? "Out of Stock" :
          newQuantity < 10 ? "Low Stock" : "In Stock";
        await axios.put("http://localhost:3001/Inventory_update", {
          id: product._id,
          Quantity: newQuantity,
          Status: status
        });
        fetchInventory();
      } else {
        message.warning(`Product "${productName}" not found in inventory.`);
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
      message.error("Failed to update inventory.");
    }
  };

  // Inventory modal management
  const handleInventoryManagement = () => {
    inventoryForm.resetFields();
    setIsInventoryModalVisible(true);
  };

  // Submit inventory changes
  const handleInventoryModalOk = async () => {
    try {
      const values = await inventoryForm.validateFields();
      const existingProduct = inventory.find(item => item.Product_Name === values.Product_Name);

      const status = values.Quantity <= 0 ? "Out of Stock" :
        values.Quantity < 10 ? "Low Stock" : "In Stock";

      if (existingProduct) {
        await axios.put("http://localhost:3001/Inventory_update", {
          id: existingProduct._id,
          ...values,
          Status: status
        });
        message.success("Inventory Updated Successfully!");
      } else {
        await axios.post("http://localhost:3001/Inventory_create", {
          ...values,
          Status: status
        });
        message.success("Product Added to Inventory Successfully!");
      }
      setIsInventoryModalVisible(false);
      fetchInventory();
    } catch (error) {
      console.error("Error saving inventory:", error);
      message.error("Failed to save inventory.");
    }
  };

  // Generate PDF report
  const generatePDF = () => {
    if (!filteredOrders.length) {
      message.warning("No sales orders available to generate PDF.");
      return;
    }
    const doc = new jsPDF();
    doc.text("Sales Orders Report", 14, 10);
    doc.autoTable({
      startY: 20,
      head: [[
        "Order ID", "Customer Name", "Product Ordered", "Quantity", "Date",
        "Total Price", "Payment Status", "Delivery Status"
      ]],
      body: filteredOrders.map(order => [
        order.Order_ID || "N/A",
        order.Customer_Name || "N/A",
        order.Product_Ordered || "N/A",
        order.Quantity || "N/A",
        order.Date || "N/A",
        `$${order.Total_Price || 0}`,
        order.Payment_status || "N/A",
        order.Delivery_status || "N/A"
      ]),
    });
    doc.save("sales_orders.pdf");
  };

  // Chart data helpers
  const getMonthlyData = () => {
    const monthlyData = {};
    orders.forEach(order => {
      if (order.Date !== "N/A") {
        const month = order.Date.substring(0, 7);
        if (!monthlyData[month]) {
          monthlyData[month] = { month, sales: 0, orders: 0 };
        }
        monthlyData[month].sales += Number(order.Total_Price || 0);
        monthlyData[month].orders += 1;
      }
    });
    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  };

  const getProductData = () => {
    const productData = {};
    orders.forEach(order => {
      const product = order.Product_Ordered;
      if (!productData[product]) {
        productData[product] = { name: product, value: 0, quantity: 0 };
      }
      productData[product].value += Number(order.Total_Price || 0);
      productData[product].quantity += Number(order.Quantity || 0);
    });
    return Object.values(productData);
  };

  const getPaymentStatusData = () => {
    const statusData = {};
    orders.forEach(order => {
      const status = order.Payment_status;
      if (!statusData[status]) {
        statusData[status] = { name: status, value: 0 };
      }
      statusData[status].value += 1;
    });
    return Object.values(statusData);
  };

  // Table columns
  const columns = [
    { title: "Order ID", dataIndex: "Order_ID", key: "Order_ID" },
    { title: "Customer", dataIndex: "Customer_Name", key: "Customer_Name" },
    { title: "Product", dataIndex: "Product_Ordered", key: "Product_Ordered" },
    { title: "Quantity", dataIndex: "Quantity", key: "Quantity" },
    { title: "Date", dataIndex: "Date", key: "Date" },
    {
      title: "Total Price",
      dataIndex: "Total_Price",
      key: "Total_Price",
      render: (price) => `$${price}`
    },
    {
      title: "Payment",
      dataIndex: "Payment_status",
      key: "Payment_status",
      render: getStatusTag,
    },
    {
      title: "Delivery",
      dataIndex: "Delivery_status",
      key: "Delivery_status",
      render: getStatusTag,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleUpdate(record)}>Update</Button>
          <Popconfirm
            title="Are you sure you want to delete this order?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Main render
  return (
    <div className="sales-order-container">
      <h2>Sales and Order Management</h2>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Orders" key="1">
          <div className="actions">
            <Input
              placeholder="Search by Customer Name or Order ID"
              value={searchText}
              onChange={e => handleSearch(e.target.value)}
              style={{ width: 300, marginBottom: 16 }}
            />
            <Space>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleNewOrder}>
                New Order
              </Button>
              <Button onClick={generatePDF}>
                Generate PDF
              </Button>
            </Space>
          </div>
          <Table
            dataSource={filteredOrders}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            bordered
          />
        </TabPane>
        <TabPane tab="Sales Analytics" key="2">
          <div className="chart-controls">
            <Space style={{ marginBottom: 16 }}>
              <Select
                defaultValue="monthly"
                style={{ width: 120 }}
                onChange={value => setChartView(value)}
              >
                <Option value="monthly">Monthly</Option>
                <Option value="product">By Product</Option>
                <Option value="payment">By Payment</Option>
              </Select>
            </Space>
          </div>
          <Row gutter={16}>
            {chartView === "monthly" && (
              <>
                <Col span={12}>
                  <Card title="Monthly Sales">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={getMonthlyData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={value => `$${value}`} />
                        <Legend />
                        <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Monthly Orders">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={getMonthlyData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="orders" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </>
            )}
            {chartView === "product" && (
              <>
                <Col span={12}>
                  <Card title="Sales by Product">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={getProductData()}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          label={entry => `${entry.name}: $${entry.value}`}
                        >
                          {getProductData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={value => `$${value}`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Quantity by Product">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={getProductData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="quantity" fill="#0088FE" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </>
            )}
            {chartView === "payment" && (
              <Col span={12}>
                <Card title="Orders by Payment Status">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getPaymentStatusData()}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#82ca9d"
                        label={entry => `${entry.name}: ${entry.value}`}
                      >
                        {getPaymentStatusData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            )}
          </Row>
        </TabPane>
      </Tabs>
      {/* Modals for order and inventory management would go here */}
    </div>
  );
};

export default SalesOrder;
