const express = require("express");
const mongoose = require('mongoose');
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const app = express();

require("dotenv").config(); 
app.use(express.json()); 

const WorkOder = require("./Routes/workoder_routes.js");






app.get('/',(req,res)=>res.send("Helow server is running .."));
app.use("/", WorkOder);
//app.listen(PORT, () => console.log(`server running on port ${PORT}`));




mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log(`port number => ${PORT} 📌`);
        app.listen(PORT, () => console.log("MongoDB Database Connected 🌿 ✅"));
    }).catch((err) => {
        console.log(err);
        console.error('MongoDB Database Connection Failed:', err);
    });
