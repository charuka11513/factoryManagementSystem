// services/InventoryPredictor.js
//const InventoryMaterial = require("../models/InventoryMaterial");
class InventoryPredictor {
  async checkAllInventory() {
    const allItems = await InventoryMaterial.find({});
    const predictions = [];
    
    for (const item of allItems) {
      const prediction = item.predictStock();
      if (prediction) {
        predictions.push({
          ...prediction,
          needs_reorder: prediction.days_until_reorder <= parseFloat(item.lead_time_days)
        });
      }
    }
    
    return predictions;
  }

  async getUrgentItems() {
    const predictions = await this.checkAllInventory();
    return predictions.filter(item => item.needs_reorder);
  }
}

module.exports = new InventoryPredictor();