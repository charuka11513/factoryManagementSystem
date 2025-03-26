const mongoose = require("mongoose");

const workSchema = mongoose.Schema(
  {
    Inventory_ID: { type: String, required: true },
    Material_Name: { type: String, required: true },
    Supplier_ID: { type: String, required: true },
    Stock_Quantity: { type: String, required: true },
    Unit_Price: { type: String, required: true },
    Reorder_Level: {type: String, required: true},
    Quality_status: { type: String, required: true },
  },
  
);

const inventorys = mongoose.model("inventorys", workSchema);
module.exports = inventorys;