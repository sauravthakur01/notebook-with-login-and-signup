const express = require("express");
const router = express.Router();
const User =require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = 'ilovecoding';
//Rote:1 creating user
router.post('/createuser',[
    body('email', "Enter a valid Email").isEmail(),
    body('name' , "Enter a valid name").isLength({ min: 3 }),
    body('password', "Enter a valid Paaword").isLength({ min: 5 })
] , async(req , res)=>{
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success,  errors: errors.array() });
    }

    //check whether the user with this email exists already
    try {
        
    let user = await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).json({success , error:'sorry a user with this email already exist'})
    }

    const salt= await bcrypt.genSaltSync(10);
    const secPass = await bcrypt.hash(req.body.password , salt)

    //create new user
    user = await User.create({
     name: req.body.name,
      password: secPass,
      email: req.body.email
   } );

   const data = {
       user:{
           id:user.id
       }
   }
   const token = jwt.sign(data , JWT_SECRET)
   success = true;
   res.json({success ,token});
} catch (error) {
     console.error(error.message);
     res.status(500).send("some error occured");
}
})

//Route2:  Authenticate a user using: post "/api/auth/login"
router.post('/login',[
    body('email', "Enter a valid Email").isEmail(),
    body('password', "Password cannot be blank ").exists()
] , async(req , res)=>{
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

   const {email , password} = req.body;
   try {
       
    let user = await User.findOne({email});
    if(!user){
        return res.status(400).json({error:'please try to login with coreect credentials'})
    }

    const comparePassword = await bcrypt.compare(password , user.password)
   if(!comparePassword){
       return res.status(400).json({success , error: "plaese try to login with correct credentials"});
        
    }

   const data = {
       user:{
           id:user.id
       }
   }
   const token = jwt.sign(data , JWT_SECRET)
    success = true ; 
   res.json({success , token});
} catch (error) {
       console.error(error.message);
       res.status(500).send("internal server error")
}
});

//Route 3:getting user details
router.post("/getuser",fetchuser ,  async (req , res)=>{
 try {
     const userId= req.user.id;
     const user = await User.findById(userId).select("-password")
     res.send(user);
     
 } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error")
 }
})


module.exports = router 