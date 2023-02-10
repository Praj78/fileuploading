const express = require('express')
const app=express()

app.use(express.json())
app.use(express.static('Content'))
const {connectDB}=require('./config/db')

app.use(express.urlencoded({extends:false}))


const PORT = 1338
app.listen(PORT,()=>{
    console.log('server is running')
    connectDB()
})