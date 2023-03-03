const chai = require('chai')
const chaiHttp = require("chai-http")
const should =chai.should()
const server = require("../index")
const API = process.env.BASE_URL
chai.use(chaiHttp)
describe('/POST testing user signup', ()=>{
    it("creates a new user",(done)=>{
        chai.request(API)
        .post('/api/v1/user/signup')
        .send({
            name:"PrajwalTTYHUTTJ",
            email: "pPrftgyhTT@gmail.com",
            password:"ujikolpoikjhTT@#lo@6969"
        })
        .end((err,res)=>{
            res.should.have.status(201)
            res.body.should.be.a('object')
            res.body.should.have.property('message')
            res.body.message.should.contain("Welcome to Devsnest PrajwalTTYHUTTJ. Thank you for signing up")
            done()
        })
    })
})
describe("/POST  testing user signin", () => {
    it("logs in a user", (done) => {
      chai
        .request(API)
        .post("/api/v1/user/signin")
        .send({
          email: "pPrftgyhTT@gmail.com",
          password: "ujikolpoikjhTT@#lo@6969",
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.message.should.equal("Signed In Successfully!");
          res.body.should.have.property("bearerToken");
          done();
        });
    });
  });
describe('/POST testing user signout', ()=>{
    it("signout the user",(done)=>{
        chai.request(API)
        .get('/api/v1/user/signout')
        .end((err,res)=>{
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('message')
            res.body.message.should.contain("cookie deleted")
            done()
        
    })
})
})