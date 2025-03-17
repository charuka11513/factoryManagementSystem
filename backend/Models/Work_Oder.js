const mongoose = require("mongoose"); 
const workSchema = mongoose.Schema({
    work_order_Id: String,
    product: String,
    machine: String,
    deadline_date: Date,
    order_status: String,
},

{
    timestamps: true  // Enabling timestamps
});

const workOdermodel = mongoose.model('WorkOrders', workSchema);  
module.exports = workOdermodel;  