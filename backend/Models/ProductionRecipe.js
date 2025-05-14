const mongoose = require("mongoose");

const materialRequirementSchema = new mongoose.Schema({
  material_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'inventorys',
    required: true
  },
  material_name: { type: String, required: true },
  quantity_per_unit: { type: Number, required: true },
  unit_of_measure: { type: String, required: true }
});

const productionRecipeSchema = new mongoose.Schema({
  product_id: { type: String, required: true, unique: true },
  product_name: { type: String, required: true },
  category: { type: String, required: true }, // e.g., "rubber", "brush"
  materials_required: [materialRequirementSchema],
  labor_hours_per_unit: { type: Number, required: true },
  labor_cost_per_hour: { type: Number, required: true },
  overhead_cost_per_unit: { type: Number, required: true },
  production_capacity_per_day: { type: Number, required: true },
  last_updated: { type: Date, default: Date.now }
}, { timestamps: true });

// Method to calculate raw material cost for one unit
productionRecipeSchema.methods.calculateMaterialCostPerUnit = async function() {
  let totalCost = 0;
  const InventoryMaterial = mongoose.model('inventorys');
  
  for (const material of this.materials_required) {
    const materialData = await InventoryMaterial.findById(material.material_id);
    if (materialData) {
      totalCost += material.quantity_per_unit * parseFloat(materialData.Unit_Price);
    }
  }
  
  return totalCost;
};

// Method to calculate total production cost per unit
productionRecipeSchema.methods.calculateTotalCostPerUnit = async function() {
  const materialCost = await this.calculateMaterialCostPerUnit();
  const laborCost = this.labor_hours_per_unit * this.labor_cost_per_hour;
  
  return {
    materialCost,
    laborCost,
    overheadCost: this.overhead_cost_per_unit,
    totalCost: materialCost + laborCost + this.overhead_cost_per_unit
  };
};

const ProductionRecipe = mongoose.model("ProductionRecipes", productionRecipeSchema);
module.exports = ProductionRecipe;