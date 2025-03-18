const mongoose = require("mongoose");

const workSchema = mongoose.Schema(
  {
    work_order_Id: { type: String, required: true },
    product: { type: String, required: true },
    quentity: { type: String, required: true },
    machine: { type: String, required: true },
    deadline_date: {
      type: Date,
      required: true,
      set: (value) => {
        // Ensure the deadline_date is stored with time as 00:00:00 (ignoring time zone)
        const date = new Date(value);
        date.setHours(0, 0, 0, 0); // Set time to 00:00:00 to store only the date
        return date;
      },
    },
    order_status: { type: String, required: true },
  },
  {
    timestamps: true, // Enabling timestamps
  }
);

const workOdermodel = mongoose.model("WorkOrders", workSchema);
module.exports = workOdermodel;
