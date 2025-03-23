const express=require("express");

const router = express.Router();

const itemmodel = require("../Models/Machine");

router.get("/machine",async(req,res)=>{
    const data= await itemmodel.find({})
    res.json({data})
})

router.post("/machine_create",async(req,res)=>{
    console.log(req.body); 
    const data=new itemmodel(req.body);
    await data.save();
    res.send({success:true,message:"data created successfuly"});
});

router.put("/machine_update",async(req,res)=>{
    const {id,...rest}=req.body
    const data=await itemmodel.updateOne({_id:id},rest)
    res.send({success:true,message:"updated successfuly",data:data})
});

router.delete("/machine_delete/:id",async(req,res)=>{
    const id=req.params.id
    const data=await itemmodel.deleteOne({_id:id})
    res.send({success:true,message:"deleted successfully",data:data})
    })

module.exports = router;