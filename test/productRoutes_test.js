const chai = require('chai')
const chaiHttp=require("chai-http")
const should=chai.should()
const { expect}=chai
const server =require('../index')
const fs=require('fs')
require('dotenv').config()

const API = process.env.BASE_URL
chai.use(chaiHttp)
describe("POST route",()=>{
    it('Creates product',async()=>{
        const response=await chai
        .request(API)
        .post('/api/v1/product/create')
        .set('Authorization','Bearer'+process.env.SAMPLE_TOKEN)
        .set('content-type',"multipart/form-data")
        .field('name','khanda lello')
        .field('price','250')
        .attach('content',fs.readFileSync(`${__dirname}/testContent/images.jpeg`))
        expect(response.body).to.be.an('object')
    })
})
describe("GET", () => {
    it("get all user products", (done) => {
      chai
        .request(API)
        .get("/api/v1/product/get/all")
        .set("Authorization", "Bearer " + process.env.SAMPLE_TOKEN)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("Products");
          res.body.Products.should.be.a("array");
          done();
        });
    });
  });