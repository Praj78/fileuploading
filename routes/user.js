const express=require('express')
const router=express.Router()
const bcrypt=require('bcrypt')
const User=require('../models/userModel')
const jwt =require('jsonwebtoken')
const {
    validateName,
    validateEmail,
    validatePassword
}=require('../utils/validators')
router.post('/signup',async(req,res)=>{
    try{      
        const {name,email,password,isSeller}=req.body
        const existingUser =await User.findOne({where:{email}})
        if(existingUser){   
            return res.status(403).json({err:"User already exists"})
        }
        if(!validateName(name)){
            return res.status(400).json({err:"Name validation fails"})
        }
        if(!validateEmail(email)){
            return res.status(400).json({err:"Email validation fails"})
        }
        if(!validatePassword(password)){
            return res.status(400).json({err:"Password validation fails"})
        }
        const hashedPassword=await bcrypt.hash(password, (saltOrRounds = 10))
        const user={
            email,
            name,
            isSeller,
            password:hashedPassword
        }
        const createdUser=await User.create(user)
        
        return res.status(201).json({
          message:  `Welcome to Devsnest ${createdUser.name}. Thank you for signing up`,
            
        })
    }catch(e){
        return res.status(500).json({err:e.message})
    }
 
})

router.post('/signin',async(req,res)=>{
    try{
        const {email,password} = req.body
        if(email.length === 0){
            return res.status(400).json({
                err:"please provide email"
            })
        }
        if(password.length === 0){
            return res.status(400).json({
                err:"please provide password"
            })
        }
        const existingUser = await User.findOne({where:{email}})
        if(!existingUser){
            return res.status(404).json({
                err:"user not found"
            })
        }
        const passwordMatched = await bcrypt.compare(password,existingUser.password)
        if(!passwordMatched){
            return res.status(404).json({
                err:'email or password mismatched'
            })
        }
        const payload ={user:{id:existingUser.id}}
        const bearerToken =await jwt.sign(payload,"SECRET MESSAGE",{expiresIn:36000})
        res.cookie('t',bearerToken,{expire:new Date()+6677})
        return res.status(200).json({
            bearerToken
        })

    }catch(e){
        return res.status(500).send(e)
    }
})

router.get('/signout',async(req,res)=>{
    try{
        res.clearCookie('t')
        return res.status(200).json({
            message:"cookie deleted"
        })
    }catch(e){
        return res.status(500).send(e)
    }
})
module.exports=router