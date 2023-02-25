const jwt =require("jsonwebtoken")
const User=require("../models/userModel")
const isAuthenticated=async(req,res,next)=>{
    try{
        const authHeader=req.headers.authorization
        if(!authHeader){
            return res.status(401).json({
                err:"authorization header not found"
            })

        }
        const token = authHeader.split(' ')[1]
        if(!token){
            return res.status(401).json({
                err:"token not found"
            })
        }
        const decoded=jwt.verify(token,"SECRET MESSAGE")
        const user = await User.findOne({where:{id:decoded.user.id}})
        if(!user){
            return res.status(404).json({
                err:"user not found"
            })
        }
        req.user=user
        next()
        
    }catch(e){
        console.log('<<<',e)
        return res.status(401).send(e)
    }

}

const isSeller=async(req,res,next)=>{
    if(req.user.dataValues.isSeller){
        next()
     }else{  res.status(401).json({
            err:"u are not seller"
        })
    }
}
const isBuyer =async(req,res,next)=>{
    if(!req.user.dataValues.isSeller){
        next()
    }else{
        res.status(401).json({
            err:"u are not buyer"
        })
    }
}
module.exports={isAuthenticated,isSeller,isBuyer}