const express=require("express")


const InventoryMaterial = require("../Models/InventoryMaterial");

const router = express.Router();

router.get("/inventorys",async(req,res)=>{
    const data= await InventoryMaterial.find({})
    res.json({data})
})


router.post("/inventorys_create",async(req,res)=>{
    console.log(req.body); 
    const data=new InventoryMaterial(req.body);
    await data.save();
    res.send({success:true,message:"data created successfuly"});
});



router.put("/inventorys_update",async(req,res)=>{
    const {id,...rest}=req.body
    const data=await InventoryMaterial.updateOne({_id:id},rest)
    res.send({success:true,message:"updated successfuly",data:data})
})




router.delete("/inventorys_delete/:id",async(req,res)=>{
const id=req.params.id
const data=await InventoryMaterial.deleteOne({_id:id})
res.send({success:true,message:"deleted successfully",data:data})
})
module.exports = router;