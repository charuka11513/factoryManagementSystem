const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
    employee_Id:{type:String, required:true},
    fullName: { type: String, required: true },
    jobRole: { type: String, required: true },
    shift: { type: String, required: true },
    assignedMachineID: { type: String, required: true  },
    attendanceRecord: { type: String, required: true }
});

const  employeemodel = mongoose.model('Employees', EmployeeSchema);
module.exports = employeemodel;