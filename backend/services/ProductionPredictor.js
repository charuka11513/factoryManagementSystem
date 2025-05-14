const mongoose = require("mongoose");
const ProductionRecipe = require("../Models/ProductionRecipe");
const WorkOrder = require("../Models/Work_Oder");
const InventoryMaterial = require("../Models/InventoryMaterial");

class ProductionPredictor {
  // Predict materials and costs based on product and quantity
  async predictProductionNeeds(productId, quantity) {
    try {
      const recipe = await ProductionRecipe.findOne({ product_id: productId });
      if (!recipe) {
        throw new Error("Product recipe not found");
      }
      
      const costBreakdown = await recipe.calculateTotalCostPerUnit();
      const materialsNeeded = [];
      
      // Calculate materials needed
      for (const material of recipe.materials_required) {
        const materialData = await InventoryMaterial.findById(material.material_id);
        const quantityNeeded = material.quantity_per_unit * quantity;
        
        materialsNeeded.push({
          material_id: material.material_id,
          material_name: material.material_name,
          quantity_needed: quantityNeeded,
          unit_of_measure: material.unit_of_measure,
          current_stock: materialData ? materialData.Stock_Quantity : 'Unknown',
          unit_price: materialData ? materialData.Unit_Price : 'Unknown',
          total_cost: materialData ? 
            (parseFloat(materialData.Unit_Price) * quantityNeeded).toFixed(2) : 'Unknown',
          has_sufficient_stock: materialData ? 
            parseFloat(materialData.Stock_Quantity) >= quantityNeeded : false
        });
      }
      
      // Calculate production time
      const productionDays = Math.ceil(quantity / recipe.production_capacity_per_day);
      
      return {
        product: {
          id: recipe.product_id,
          name: recipe.product_name
        },
        quantity_ordered: quantity,
        materials_needed: materialsNeeded,
        cost_per_unit: costBreakdown,
        total_cost: {
          materials: costBreakdown.materialCost * quantity,
          labor: costBreakdown.laborCost * quantity,
          overhead: costBreakdown.overheadCost * quantity,
          total: costBreakdown.totalCost * quantity
        },
        production_time_days: productionDays,
        insufficient_materials: materialsNeeded.filter(m => !m.has_sufficient_stock)
      };
    } catch (error) {
      console.error("Production prediction error:", error);
      throw error;
    }
  }
  
  // Predict materials needed for all pending work orders
  async predictMaterialsForPendingOrders() {
    try {
      const pendingOrders = await WorkOrder.find({ order_status: "Pending" });
      const predictions = [];
      
      for (const order of pendingOrders) {
        try {
          const prediction = await this.predictProductionNeeds(order.product, parseFloat(order.quentity));
          predictions.push({
            work_order_id: order.work_order_Id,
            deadline: order.deadline_date,
            ...prediction
          });
        } catch (err) {
          console.error(`Prediction failed for order ${order.work_order_Id}:`, err);
        }
      }
      
      return predictions;
    } catch (error) {
      console.error("Failed to predict materials for pending orders:", error);
      throw error;
    }
  }
}

module.exports = new ProductionPredictor();