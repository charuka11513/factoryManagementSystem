const express = require("express");
const DBconnection = require("./config/db.js")
const app = express();
const PORT =3001;


DBconnection();














app.get('/',(req,res)=>res.send("Helow server is running ..."));

app.listen(PORT, () => console.log(`server running on port ${PORT}`));

