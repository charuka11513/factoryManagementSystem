const express = require("express");
const mongoose = require('mongoose');
require("dotenv").config();
const cors = require('cors');

const PORT = process.env.PORT || 3002;
const app = express();

require("dotenv").config(); 
app.use(express.json()); 
app.use(cors());

//declare the parth hear
const WorkOder = require("./Routes/workoder_routes.js");
const Admins = require("./Routes/admin_rout.js");
const machine = require("./Routes/machine_routes.js");
const employee = require("./Routes/employee_routes.js");
const Sales = require("./Routes/SalesAndOrder.js");
const Production = require("./Routes/production_routes.js"); // Add this line
const Inventorys = require("./Routes/InventoryMaterial.js");





app.get('/',(req,res)=>res.send("Helow server is running .."));

app.use("/", WorkOder);
app.use("/",Admins);
app.use("/",machine);
app.use("/",employee);
app.use("/", Sales);
app.use("/", Production); // Add this line
app.use("/", Inventorys);


mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log(`port number => ${PORT} 📌`);
        app.listen(PORT, () => console.log("MongoDB Database Connected 🌿 ✅"));
    }).catch((err) => {
        console.log(err);
        console.error('MongoDB Database Connection Failed:', err);
    });
