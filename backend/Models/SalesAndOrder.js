const mongoose = require("mongoose");

const workSchema = mongoose.Schema(
  {
    Order_ID: { type: String, required: true },
    Customer_Name: { type: String, required: true },
    Product_Ordered: { type: String, required: true },
    Quantity: { type: String, required: true },
    Total_Price: { type: String, required: true },
    Payment_status: {type: String, required: true},
    Delivery_status: { type: String, required: true },
    Date: {type: String, required: true},
  },
  
);

const SalesOrders = mongoose.model("SalesOrders", workSchema);
module.exports = SalesOrders;
