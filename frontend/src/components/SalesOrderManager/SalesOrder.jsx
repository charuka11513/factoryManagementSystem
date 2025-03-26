import React, { useState, useEffect } from "react";
import { Table, Button, Input, Tag, Space, Modal, Form, InputNumber, Select, DatePicker } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Ensure correct import
import moment from "moment";
import "./SalesOrder.css";

const { Option } = Select;

const SalesOrder = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get("http://localhost:3001/SalesOrder");
            console.log("Fetched Orders:", response.data.data); 

            const formattedOrders = (response.data.data || []).map(order => ({
                ...order,
                Date: order.Date ? moment(order.Date).format("YYYY-MM-DD") : "N/A",
            }));

            setOrders(formattedOrders);
            setFilteredOrders(formattedOrders.length > 0 ? formattedOrders : []);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const handleSearch = (value) => {
        setSearchText(value);
        const filteredData = orders.filter(order =>
            order.Customer_Name.toLowerCase().includes(value.toLowerCase()) ||
            order.Order_ID.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredOrders(filteredData);
    };

    const getStatusTag = (status) => {
        const colors = {
            Pending: "gold",
            Paid: "green",
            Processing: "blue",
            Finished: "green",
        };
        return <Tag color={colors[status] || "default"}>{status}</Tag>;
    };

    const handleNewOrder = () => {
        setEditingOrder(null);
        form.resetFields();
        setIsModalVisible(true);
    };

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

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingOrder) {
                await axios.put("http://localhost:3001/SalesOrder_update", {
                    id: editingOrder._id,
                    ...values,
                    Date: values.Date ? values.Date.format("YYYY-MM-DD") : null,
                });
            } else {
                const newOrder = {
                    Order_ID: `ORD-${Date.now()}`,
                    ...values,
                    Date: values.Date ? values.Date.format("YYYY-MM-DD") : null,
                };
                await axios.post("http://localhost:3001/SalesOrder_create", newOrder);
            }
            setIsModalVisible(false);
            fetchOrders();
        } catch (error) {
            console.error("Error saving order:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/SalesOrder_delete/${id}`);
            const updatedOrders = orders.filter(order => order._id !== id);
            setOrders(updatedOrders);
            setFilteredOrders(updatedOrders);
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };

    const generatePDF = () => {
        if (!filteredOrders || filteredOrders.length === 0) {
            alert("No sales orders available to generate PDF.");
            return;
        }

        const doc = new jsPDF();
        doc.text("Sales Orders Report", 14, 10);

        doc.autoTable({
            startY: 20,
            head: [["Order ID", "Customer Name", "Product Ordered", "Quantity", "Date", "Total Price", "Payment Status", "Delivery Status"]],
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

    const columns = [
        { title: "Order ID", dataIndex: "Order_ID", key: "Order_ID", width: 180 },
        { title: "Customer", dataIndex: "Customer_Name", key: "Customer_Name", width: 100 },
        { title: "Product", dataIndex: "Product_Ordered", key: "Product_Ordered", width: 120 },
        { title: "Quantity", dataIndex: "Quantity", key: "Quantity", width: 80 },
        { title: "Date", dataIndex: "Date", key: "Date", width: 100 },
        { title: "Total Price", dataIndex: "Total_Price", key: "Total_Price", width: 100 },
        { title: "Payment", dataIndex: "Payment_status", key: "Payment_status", render: getStatusTag, width: 100 },
        { title: "Delivery", dataIndex: "Delivery_status", key: "Delivery_status", render: getStatusTag, width: 100 },
        {
            title: "Actions",
            key: "actions",
            width: 150,
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => handleUpdate(record)}>Update</Button>
                    <Button type="link" danger onClick={() => handleDelete(record._id)}>Delete</Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="sales-order-container">
            <h2>Sales and Order Management</h2>
            <div className="actions">
                <Input
                    placeholder="Search by Customer Name or Order ID"
                    value={searchText}
                    onChange={e => handleSearch(e.target.value)}
                    style={{ width: 300, marginBottom: 16 }}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={handleNewOrder}>
                    New Order
                </Button>
                <Button type="default" onClick={generatePDF} style={{ marginLeft: "10px" }}>
                    Generate PDF
                </Button>
            </div>
            <Table dataSource={filteredOrders} columns={columns} rowKey="_id" pagination={{ pageSize: 5 }} bordered />

            <Modal title={editingOrder ? "Update Order" : "New Order"} open={isModalVisible} onOk={handleModalOk} onCancel={() => setIsModalVisible(false)}>
            <Form form={form} layout="vertical">
            <Form.Item name="Customer_Name" label="Customer Name" rules={[{ required: true, message: "Please enter the customer's name!" }]}>
                <Input />
            </Form.Item>

            <Form.Item name="Product_Ordered" label="Product Ordered" rules={[{ required: true, message: "Please enter the product ordered!" }]}>
                <Input />
            </Form.Item>

            <Form.Item name="Quantity" label="Quantity" rules={[{ required: true, message: "Please enter the quantity!" }]}>
                <InputNumber style={{ width: "100%" }} min={1} />
            </Form.Item>

            <Form.Item name="Date" label="Date" rules={[{ required: true, message: "Please select the order date!" }]}>
                <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="Total_Price" label="Total Price ($)" rules={[{ required: true, message: "Please enter the total price!" }]}>
                <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>

            <Form.Item name="Payment_status" label="Payment Status" rules={[{ required: true, message: "Please select the payment status!" }]}>
                <Select placeholder="Select Payment Status">
                    <Option value="Pending">Pending</Option>
                    <Option value="Paid">Paid</Option>
                </Select>
            </Form.Item>

            <Form.Item name="Delivery_status" label="Delivery Status" rules={[{ required: true, message: "Please select the delivery status!" }]}>
                <Select placeholder="Select Delivery Status">
                    <Option value="Processing">Processing</Option>
                    <Option value="Finished">Finished</Option>
                 </Select>
            </Form.Item>
            </Form>
            </Modal>
        </div>
    );
};

export default SalesOrder;
