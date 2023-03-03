const express = require('express')
const router=express.Router()
const upload = require('../utils/fileUpload')
const Product=require('../models/productModels')
require("dotenv").config()
const {isAuthenticated,isSeller, isBuyer}=require('../middlewares/auth')
const Order=require("../models/orderModel")
const stripe = require('stripe')(process.env.STRIPE)
const {WebhookClient}=require('discord.js')
const BASE_URL = process.env.BASE_URL;


const webhook= new WebhookClient({
    url:process.env.DISCORD,
})


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
    
    return res.status(201).json({ message: "Product created" ,productDetails:createdProduct})
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

router.post('/buy/:productID',isAuthenticated,isBuyer,async(req,res)=>{
    try{
        const product=await Product.findOne({
            where:{
                id:req.params.productID
            }
        })
        const pro=product.dataValues
        console.log('.....>>>',req.params.productID,pro)
        
        if(!product){
            return res.status(404).json({err:"no product found"})
        }
        
        const orderDetails = {
            productID: product.dataValues.id,
            productName: product.dataValues.name,
            productPrice: product.dataValues.price,
            buyerID: req.user.dataValues.id,
            buyerEmail: req.user.dataValues.email,
            

        }
        
        let paymentMethod =await stripe.paymentMethods.create({
            type:'card',
            card:{
                number:"4242424242424242",
                exp_month:9,
                exp_year:2023,
                cvc:'314'
            },
        })
        let paymentIntent = await stripe.paymentIntents.create({
            amount:product.dataValues.price * 100,
            currency:"inr",
            payment_method_types:['card'],
            payment_method:paymentMethod.id,
            confirm:true
        })
        if(paymentIntent){
            const createOrder = await Order.create(orderDetails)
            webhook.send({
                content:`i am sending it from order id:${createOrder.id}`,

                username:'orders',
                avatarURL:"https://i.imgur.com/AfFp7pu.png"
            })
            return res.status(200).json({createOrder})
        }else{
            return res.status(400).json({err:"payment failed"})
        }
    }catch(err){
        return res.status(500).json({err:err.message})
    }
})





module.exports=router
