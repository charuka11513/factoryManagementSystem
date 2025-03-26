const express = require("express");
const AdminModel = require("../Models/admins"); // Import your Admin model


const router = express.Router();

router.get("/admin", async (req, res) => {
    try {
      const data = await AdminModel.find({});
      res.json({ data });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch admin data" });
    }
  });
  
  router.post("/admin_create", async (req, res) => {
    try {
      const data = new AdminModel(req.body);
      await data.save();
      res.send({ success: true, message: "Admin created successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to create admin" });
    }
  });
  
  router.put("/admin_update", async (req, res) => {
    const { id, ...rest } = req.body;
    try {
      const data = await AdminModel.updateOne({ _id: id }, rest);
      res.send({ success: true, message: "Admin updated successfully", data });
    } catch (err) {
      res.status(500).json({ error: "Failed to update admin" });
    }
  });
  
  router.delete("/admin_delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const data = await AdminModel.deleteOne({ _id: id });
      res.send({ success: true, message: "Admin deleted successfully", data });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete admin" });
    }
  });
  
  module.exports = router;