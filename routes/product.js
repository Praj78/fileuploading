const express = require('express')
const router=express.Router()
const upload = require('../utils/fileUpload')
const Product=require('../models/productModels')
const {isAuthenticated,isSeller}=require('../middlewares/auth')
router.post('/create',isAuthenticated,isSeller,(req,res)=>{
    upload(req,res,async(err)=>{
        if(err){
            console.log("error is ",err)
            return res.status(500).send(err)
        }
        const {name,price}=req.body
        if(!name || !price || !req.file){
            return res.status(400).json({
                err:"we require all three data => name,file and price"
            })
        }
        if(Number.isNaN(price)){
            return res.status(400).json({
                err:"price should be number"
            })
        }
        let productDetails={
            name,
            price,
            content:req.file.path
        }
    const createdProduct = await Product.create(productDetails);

    console.log("Created Product", createdProduct);
    
    return res.status(201).json({ message: "Product created" ,productDetails})
    })

})
router.get('/get/all',isAuthenticated,async(_req,res)=>{
    try{
        const products=await Product.findAll()
        return res.status(200).json({Products:products})

    }catch(err){
        console.log(err.message)
        return res.status(500).json({err:err.message})
    }
})





module.exports=router
