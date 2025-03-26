const express = require("express");
//const InventoryMaterial = require("../models/InventoryMaterial");
const InventoryPredictor = require("../services/InventoryPredictor");

const router = express.Router();

// 1. GET ALL INVENTORY ITEMS
router.get("/inventorys", async (req, res) => {
    try {
        const data = await InventoryMaterial.find({});
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: "Failed to fetch inventory data",
            details: err.message 
        });
    }
});

// 2. CREATE NEW INVENTORY ITEM
router.post("/inventorys_create", async (req, res) => {
    try {
        const newItem = new InventoryMaterial({
            ...req.body,
            consumption_history: [] // Initialize empty array
        });
        await newItem.save();
        res.json({ 
            success: true, 
            message: "Inventory item created successfully",
            data: newItem
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: "Failed to create inventory item",
            details: err.message
        });
    }
});

// 3. UPDATE INVENTORY ITEM
router.put("/inventorys_update", async (req, res) => {
    try {
        const { id, ...updateData } = req.body;
        const updatedItem = await InventoryMaterial.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true }
        );
        res.json({
            success: true,
            message: "Inventory updated successfully",
            data: updatedItem
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: "Failed to update inventory",
            details: err.message
        });
    }
});

// 4. DELETE INVENTORY ITEM
router.delete("/inventorys_delete/:id", async (req, res) => {
    try {
        await InventoryMaterial.findByIdAndDelete(req.params.id);
        res.json({
            success: true,
            message: "Inventory deleted successfully"
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: "Failed to delete inventory",
            details: err.message
        });
    }
});

// 5. RECORD MATERIAL CONSUMPTION (NEW)
router.post("/inventorys/:id/consume", async (req, res) => {
    try {
        const { quantity_used, work_order_id } = req.body;
        
        await InventoryMaterial.findByIdAndUpdate(
            req.params.id,
            { 
                $push: { 
                    consumption_history: {
                        date: new Date(),
                        quantity_used,
                        work_order_id
                    } 
                },
                $inc: { Stock_Quantity: -quantity_used } // Auto-decrement stock
            }
        );
        
        res.json({ 
            success: true,
            message: "Consumption recorded successfully"
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: "Failed to record consumption",
            details: err.message
        });
    }
});

// 6. GET STOCK PREDICTION (NEW)
router.get("/inventorys/:id/predict", async (req, res) => {
    try {
        const item = await InventoryMaterial.findById(req.params.id);
        if (!item) {
            return res.status(404).json({
                success: false,
                error: "Inventory item not found"
            });
        }

        const prediction = item.predictStock();
        if (!prediction) {
            return res.status(400).json({
                success: false,
                error: "Insufficient consumption data for prediction"
            });
        }

        res.json({
            success: true,
            data: prediction
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Prediction failed",
            details: err.message
        });
    }
});

// 7. GET URGENT REORDER ITEMS (NEW)
router.get("/inventorys/reorder/urgent", async (req, res) => {
    try {
        const urgentItems = await InventoryPredictor.getUrgentReorderItems();
        res.json({
            success: true,
            count: urgentItems.length,
            data: urgentItems
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: "Failed to check reorders",
            details: err.message
        });
    }
});

module.exports = router;