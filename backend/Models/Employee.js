const mongoose = require("mongoose");


const employeeSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, 
    employee_Id: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    jobRole: { type: String, required: true },
    shift: { type: String, required: true },
    assignedMachineID: { type: String },
    attendanceRecord: { type: String },
  },
  { timestamps: true }
);

// Create and export the model
const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
