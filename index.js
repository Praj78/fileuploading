const express = require('express')
const {connectDB}=require('./config/db')
const userRotes=require('./routes/user')
const productRoutes=require('./routes/product')

const app=express()
app.use(express.json())
app.use(express.static('content'))
app.use(express.urlencoded({extended:false}))

const PORT = 1356
app.use('/api/v1/user',userRotes)
app.use('/api/v1/product',productRoutes)
app.listen(PORT,()=>{
    console.log('server is running')
    connectDB()
})