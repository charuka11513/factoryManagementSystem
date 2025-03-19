const mongoose = require("mongoose");

const workSchema = mongoose.Schema(
  {
    work_order_Id: { type: String, required: true },
    product: { type: String, required: true },
    quentity: { type: String, required: true },
    machine: { type: String, required: true },
    deadline_date: {type: Date, required: true},
    order_status: { type: String, required: true },
  },
  
  {
    timestamps: true, // Enabling timestamps
  }
);

const workOdermodel = mongoose.model("WorkOrders", workSchema);
module.exports = workOdermodel;
