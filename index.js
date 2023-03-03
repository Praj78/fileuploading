const express = require('express')
const {connectDB}=require('./config/db')
const userRotes=require('./routes/user')
const productRoutes=require('./routes/product')

require('dotenv').config()

const app=express()
app.use(express.json())
app.use(express.static('content'))
app.use(express.urlencoded({extended:false}))

const swaggerUI=require('swagger-ui-express')
const swaggerJsDoc=require('swagger-jsdoc')

const PORT = process.env.PORT
const spec = swaggerJsDoc({
    definition:{
        openapi :"3.0.0",
        info:{
         title:"photo store api",
          version:"1.0.0",
         description:"buy or sell photos"
         },
        servers:[
            {
            url:process.env.BASE_URL,
            }
        ]

        

    },
    apis:['./routes/*.js']
})
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(spec))
app.use('/api/v1/user',userRotes)
app.use('/api/v1/product',productRoutes)
app.listen(PORT,()=>{
    console.log('server is running ',PORT)
    connectDB()
})