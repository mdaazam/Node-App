const jwt = require('jsonwebtoken');

const Register = require('../models/registers');

const auth = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        console.log("token-----", token)
        const verifyUsers = jwt.verify(token, "agvcdhgw47285bhvfbdjf@#gfdgyvreughukerjgbioejitgor");
        console.log("verfying users------------------",verifyUsers);

        const user = await Register.findOne({_id:verifyUsers._id})
        console.log("users------------------",user);
        next();
    }catch(e){
        res.status(401).send(e)
    }
}

module.exports = auth;