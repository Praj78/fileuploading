const { Sequelize } =require('sequelize')
const createDB = new Sequelize('test-db','user','pass',{
    dialect:"sqlite",
    host:"./config/db.sqlite",
})
const connectDB =()=>{
    createDB.sync().then(()=>{
        console.log('connected to db')
    })
.catch((e)=>{
    console.log('db connection failed',e)
})

}

module.exports ={createDB,connectDB}

const userModel = require('../models/userModel')
const orderModel = require('../models/orderModel')

orderModel.belongsTo(userModel,{foreignKey:"buyerID"})
userModel.hasMany(orderModel,{foreignKey:"id"})
