const express = require("express");
const router = express.Router();
const ProductionRecipe = require("../Models/ProductionRecipe");
const ProductionPredictor = require("../services/ProductionPredictor");

// Get all product recipes
router.get("/production/recipes", async (req, res) => {
  try {
    const recipes = await ProductionRecipe.find({});
    res.json({ success: true, data: recipes });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch recipes",
      details: err.message
    });
  }
});

// Get recipe by ID
router.get("/production/recipes/:id", async (req, res) => {
  try {
    const recipe = await ProductionRecipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({
        success: false,
        error: "Recipe not found"
      });
    }
    res.json({ success: true, data: recipe });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch recipe",
      details: err.message
    });
  }
});

// Create new recipe
router.post("/production/recipes", async (req, res) => {
  try {
    const newRecipe = new ProductionRecipe(req.body);
    await newRecipe.save();
    res.json({
      success: true,
      message: "Recipe created successfully",
      data: newRecipe
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: "Failed to create recipe",
      details: err.message
    });
  }
});

// Update recipe
router.put("/production/recipes/:id", async (req, res) => {
  try {
    const updatedRecipe = await ProductionRecipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedRecipe) {
      return res.status(404).json({
        success: false,
        error: "Recipe not found"
      });
    }
    
    res.json({
      success: true,
      message: "Recipe updated successfully",
      data: updatedRecipe
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: "Failed to update recipe",
      details: err.message
    });
  }
});

// Delete recipe
router.delete("/production/recipes/:id", async (req, res) => {
  try {
    const deletedRecipe = await ProductionRecipe.findByIdAndDelete(req.params.id);
    
    if (!deletedRecipe) {
      return res.status(404).json({
        success: false,
        error: "Recipe not found"
      });
    }
    
    res.json({
      success: true,
      message: "Recipe deleted successfully"
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: "Failed to delete recipe",
      details: err.message
    });
  }
});

// Predict materials and cost for a product
router.get("/production/predict/:productId/:quantity", async (req, res) => {
  try {
    const { productId, quantity } = req.params;
    const prediction = await ProductionPredictor.predictProductionNeeds(
      productId, 
      parseFloat(quantity)
    );
    
    res.json({
      success: true,
      data: prediction
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: "Prediction failed",
      details: err.message
    });
  }
});

// Predict materials for all pending orders
router.get("/production/predict-pending", async (req, res) => {
  try {
    const predictions = await ProductionPredictor.predictMaterialsForPendingOrders();
    
    res.json({
      success: true,
      count: predictions.length,
      data: predictions
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to predict for pending orders",
      details: err.message
    });
  }
});

// Debug route to check available recipes and pending orders
router.get("/production/debug", async (req, res) => {
  try {
    const recipes = await ProductionRecipe.find({}, 'product_id product_name');
    const pendingOrders = await require('../Models/Work_Oder').find(
      { order_status: "Pending" }, 
      'work_order_Id product quentity'
    );
    
    // Get all inventory materials
    const materials = await require('../Models/InventoryMaterial').find(
      {}, 
      '_id Material_Name Stock_Quantity'
    );
    
    res.json({
      success: true,
      recipes: recipes,
      pendingOrders: pendingOrders,
      materials: materials,
      tips: [
        "Make sure the 'product' field in work orders matches the 'product_id' in recipes",
        "At least two materials need to be in inventory",
        "Each recipe requires valid material IDs from inventory"
      ]
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Debug check failed",
      details: err.message
    });
  }
});

module.exports = router;

// // add-sample-recipe.js
// require('dotenv').config();
// const mongoose = require('mongoose');
// const ProductionRecipe = require('./backend/Models/ProductionRecipe');

// async function addSampleRecipes() {545
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('Connected to MongoDB');
    
//     // Get actual inventory IDs
//     const InventoryMaterial = mongoose.model('inventorys');
//     const materials = await InventoryMaterial.find().limit(2);
    
//     if (materials.length < 2) {
//       console.log('Error: Need at least 2 materials in inventory');
//       return;
//     }
    
//     // Create sample recipes for 5 products
//     const recipes = [
//       {
//         product_id: "RUBBER-001",
//         product_name: "Standard Rubber Band",
//         category: "rubber",
//         materials_required: [
//           {
//             material_id: materials[0]._id,
//             material_name: materials[0].Material_Name,
//             quantity_per_unit: 0.05,
//             unit_of_measure: "kg"
//           },
//           {
//             material_id: materials[1]._id,
//             material_name: materials[1].Material_Name,
//             quantity_per_unit: 0.01,
//             unit_of_measure: "kg"
//           }
//         ],
//         labor_hours_per_unit: 0.02,
//         labor_cost_per_hour: 15,
//         overhead_cost_per_unit: 0.1,
//         production_capacity_per_day: 5000
//       },
//       {
//         product_id: "BRUSH-001",
//         product_name: "Standard Brush",
//         category: "brush",
//         materials_required: [
//           {
//             material_id: materials[0]._id,
//             material_name: materials[0].Material_Name,
//             quantity_per_unit: 0.1,
//             unit_of_measure: "kg"
//           },
//           {
//             material_id: materials[1]._id,
//             material_name: materials[1].Material_Name,
//             quantity_per_unit: 0.02,
//             unit_of_measure: "kg"
//           }
//         ],
//         labor_hours_per_unit: 0.05,
//         labor_cost_per_hour: 15,
//         overhead_cost_per_unit: 0.2,
//         production_capacity_per_day: 2000
//       }
//     ];
    
//     // Insert recipes
//     await ProductionRecipe.insertMany(recipes);
//     console.log('Sample recipes added successfully');
    
//   } catch (error) {
//     console.error('Error adding sample recipes:', error);
//   } finally {
//     mongoose.disconnect();
//   }
// }

// addSampleRecipes();