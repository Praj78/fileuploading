const express=require('express')
const router=express.Router()
const bcrypt=require('bcrypt')
const User=require('../models/userModel')
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
        console.log('>>>',e)
        return res.status(500).json({err:e.message})
    }
 
})

module.exports=router