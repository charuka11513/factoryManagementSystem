// models/InventoryMaterial.js
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
    // New AI fields
    consumption_history: [{
      date: { type: Date, default: Date.now },
      quantity_used: String,
      work_order_id: String
    }],
    lead_time_days: { type: String, default: "7" },
    min_order_qty: { type: String, default: "10" }
  },
  { timestamps: true }
);

// Calculate average consumption (last 30 days)
workSchema.methods.getAverageConsumption = function() {
  if (this.consumption_history.length === 0) return "0";
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentConsumption = this.consumption_history
    .filter(entry => entry.date >= thirtyDaysAgo)
    .reduce((sum, entry) => sum + parseFloat(entry.quantity_used), 0);
    
  return (recentConsumption / 30).toFixed(2);
};

// Predict stock depletion
workSchema.methods.predictStock = function() {
  const avgConsumption = parseFloat(this.getAverageConsumption());
  const currentStock = parseFloat(this.Stock_Quantity);
  const reorderLevel = parseFloat(this.Reorder_Level);
  
  if (avgConsumption <= 0) return null;

  return {
    material: this.Material_Name,
    current_stock: currentStock,
    daily_consumption: avgConsumption,
    days_until_reorder: Math.floor((currentStock - reorderLevel) / avgConsumption),
    days_until_empty: Math.floor(currentStock / avgConsumption),
    suggested_order: Math.max(
      (avgConsumption * parseFloat(this.lead_time_days)).toFixed(2),
      parseFloat(this.min_order_qty)
    )
  };
};

const inventorys = mongoose.model("inventorys", workSchema);
module.exports = inventorys;