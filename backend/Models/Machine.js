const mongoose = require("mongoose");

const machineSchema = mongoose.Schema(
    {
      machine_Id: { type: String, required: true },
      machine_name: { type: String, required: true },
      model: { type: String, required: true },
      assigned_workOrder_ID: { type: String, required: true },
      last_maintenance_date: {type: Date, required: true},
      machine_status: { type: String, required: true },
    },
);

const machinemodel = mongoose.model("Machines", machineSchema);
module.exports = machinemodel;