const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
  {
    adminName: { type: String, required: true }, 
    position: { type: String, required: true }, 
    password: { type: String, required: true }, 
  },

);

const AdminModel = mongoose.model("Admin", adminSchema);
module.exports = AdminModel;
