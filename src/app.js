require('dotenv').config()
const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();
const hbs = require('hbs');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser')
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: 'rzp_test_rv8z7NFhQ8r0XN',
    key_secret: 'Pn4JS5BIYufMobpbePkqtzys',
})

const auth = require('./middleware/auth')

require("./db/conn")
const Register = require("./models/registers");
const { cookie } = require('express/lib/response');

const static_path = path.join(__dirname,'../public')
const templates_path = path.join(__dirname,'../templates/views')
const partials_path = path.join(__dirname,'../templates/partials')

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))

app.use(express.static(static_path));

app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path);


app.get('/', (req,res) => {
    res.render('index')
})

app.get('/secret', auth ,(req,res) => {
 res.render('secret')
})

app.get('/register',(req,res) => {
    res.render('register')
})

app.post('/register', async (req,res) => {
   try{
    const password = req.body.password;
    const cPassword = req.body.cPassword;

    if(password === cPassword){
        const registerEmployee = new Register({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            password: password,
            cPassword: cPassword,
            state: req.body.state,
            city: req.body.city,
            gender: req.body.gender,
        })

        const token =await registerEmployee.generateAuthToken();
        res.cookie("jwt", token,{
            expires:new Date(Date.now() + 900000000000),
            httpOnly:true
        })
        console.log(cookie)
        const registered = await registerEmployee.save();
        res.status(201).render('index');
    }else{
        res.send("Password does not match")
    }
   }catch(error){
       res.status(400).send(error)
   }
})

app.get('/login',(req,res) => {
    res.render('login')
})
app.post('/login',async(req,res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;

        const userEmail = await Register.findOne({email:email})
        const isMatched = await bcrypt.compare(password, userEmail.password)
        const token =await userEmail.generateAuthToken();
        console.log("the token part" + " " + token)
        res.cookie("jwt", token,{
            expires:new Date(Date.now() + 9000000),
            httpOnly:true,
            //secure:true
        })
         
        if(isMatched){
            res.status(201).render("homepage")
        }else{
            res.send("Invalid Login Credentials")
        }

    }catch(error){
        res.status(400).send("Invalid Login Credentials")
    }
})

app.post('/order1',(req,res) => {
    try{
        let options = {
            amount: 50000,  // amount in the smallest currency unit
            currency: "INR",
          };
          razorpay.orders.create(options, function(err, order) {
            console.log(order);
            res.json(order)
          });
    }catch(e){
        console.log("error",e)
    }
    
})

app.post('/order2',(req,res) => {
    try{
        let options = {
            amount: 1000 * 100,  // amount in the smallest currency unit
            currency: "INR",
          };
          razorpay.orders.create(options, function(err, order) {
            console.log(order);
            res.json(order)
          });
    }catch(e){
        console.log("error2",e)
    }
})

app.post('/order3',(req,res) => {
    try{
        let options = {
            amount: 5000 * 100,  // amount in the smallest currency unit
            currency: "INR",
          };
          razorpay.orders.create(options, function(err, order) {
            console.log(order);
            res.json(order)
          });
    }catch(e){
        console.log("error2",e)
    }
})

app.listen(port, () => {
    console.log(`app is listening on ${port}`)
})