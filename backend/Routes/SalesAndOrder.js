const express=require("express")


const itemmodel = require("../Models/SalesAndOrder");

const router = express.Router();

router.get("/SalesOrder",async(req,res)=>{
    const data= await itemmodel.find({})
    res.json({data})
})


router.post("/SalesOrder_create",async(req,res)=>{
    console.log(req.body); 
    const data=new itemmodel(req.body);
    await data.save();
    res.send({success:true,message:"data created successfuly"});
});



router.put("/SalesOrder_update",async(req,res)=>{
    const {id,...rest}=req.body
    const data=await itemmodel.updateOne({_id:id},rest)
    res.send({success:true,message:"updated successfuly",data:data})
})




router.delete("/SalesOrder_delete/:id",async(req,res)=>{
const id=req.params.id
const data=await itemmodel.deleteOne({_id:id})
res.send({success:true,message:"deleted successfully",data:data})
})
module.exports = router;