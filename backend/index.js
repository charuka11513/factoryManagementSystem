const express = require("express");
const mongoose = require('mongoose');
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const app = express();

require("dotenv").config(); 
app.use(express.json()); 

//declare the parth hear
const WorkOder = require("./Routes/workoder_routes.js");






app.get('/',(req,res)=>res.send("Helow server is running .."));
app.use("/", WorkOder);










mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log(`port number => ${PORT} 📌`);
        app.listen(PORT, () => console.log("MongoDB Database Connected 🌿 ✅"));
    }).catch((err) => {
        console.log(err);
        console.error('MongoDB Database Connection Failed:', err);
    });
