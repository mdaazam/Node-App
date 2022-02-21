require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const employeeSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required: true
    },
    lastName:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    phone:{
        type:Number,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required: true
    },
    cPassword:{
        type:String,
        required: true
    },
    state:{
        type:String,
        required: true
    },
    city:{
        type:String,
        required: true
    },
    gender:{
        type:String,
        required: true
    },
    tokens:[{
        token:{
            type:String,
            required: true
        }
    }]
})

employeeSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id:this._id.toString()}, "agvcdhgw47285bhvfbdjf@#gfdgyvreughukerjgbioejitgor");
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    }catch(e){
        res.status(400).send(e)
    }
}

employeeSchema.pre("save",async function(next) {

    if(this.isModified("password")){
        this.password =await bcrypt.hash(this.password, 10)
        this.cPassword = await bcrypt.hash(this.cPassword, 10)
    }
    next();
})

const Register = new mongoose.model("Register", employeeSchema)

module.exports = Register;