const User= require('../models/user.model');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const secretConfig= require('../configs/auth.configs');
/**
 * signup API;
 */

exports.signup= async (req,res)=>{

    var userTypeReq= req.body.userType;
    var userStatusReq= "Approved";

    if(userTypeReq=="Engineer"){
        userStatusReq= "Pending";
    }

    const userObj={
        name: req.body.name,
        userId: req.body.userId,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password,8),
        userType: req.body.userType,
        userStatus: userStatusReq
    };
    try{
        const user= await User.create(userObj);
        res.status(200).send({
        name: user.name,
        userId: user.userId,
        email: user.email,
        userType: user.userType,
        userStatus: user.userStatus,
        });
    }catch(err){
       console.log("Error in creating user",err.message);
       res.status(500).send({
           message:"internal server error"
       })
    }
}


exports.signin= async (req,res)=>{
    const user= await User.findOne({userId : req.body.userId});

    if(user==null){
        return res.status(400).send({
            message:  "UserId doesn't exist."
        });
    }
    if(user.userStatus!="Approved" && bcrypt.compareSync(req.body.password,user.password)){
         return res.status(200).send({
             message:`User status is still ${user.userStatus}`
         });
        } 
    if(!bcrypt.compareSync(req.body.password,user.password)){
        return res.status(200).send({
            message: "Invalid password"
        });
    }
    /**
     * create JWT token and send to user
     */
    const token= jwt.sign({id: user.userId},secretConfig.secret,{expiresIn:5000});
    res.status(200).send({
        name: user.name,
        userId: user.userId,
        email: user.email,
        userType: user.userType,
        userStatus: user.userStatus,
        accessToken: token
    }); 

    }