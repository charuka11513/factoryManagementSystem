const mongoose = require('mongoose');
const dburl = "mongodb+srv://ashandilakshana:ashan1234@cluster02.f9xsp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster02";



mongoose.set("strictQuery", true,"userNewUrlparser", true);


const connection = async ()=>{
    try{
        await mongoose.connect(dburl);
        console.log('MongoDB connected.🌿🌿.');
    }catch (e){
        console.error}
        process.exit();
};    


 module.exports = connection;  
