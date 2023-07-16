
const User= require('../models/user.model');
const objectConverter= require('../utils/objectConverter');

/**
 * fetch list of all the users (Later we will modify as per requirement);
 */

exports.findAll= async (req,res)=>{
       try{
           let userQuery= {};
           let userTypeReq=req.query.userType;
           let userStatusReq= req.query.userStatus;

           if(userTypeReq){
               userQuery.userType=userTypeReq;
           }
           if(userStatusReq){
               userQuery.userStatus= userStatusReq;
           }

           const users= await User.find(userQuery);
           res.status(200).send(objectConverter.userResponse(users));
       }catch(err){
           res.status(500).send({
               message: "Internal Server Error"
           })
       }
}


  
exports.findById = async(req, res)=>{ 
    const userIdReq= req.params.userId;
    
    try{
        const user = await User.findOne({userId:userIdReq});

        if(!user){
            return res.status(200).send(`User with this ${userIdReq} does not exist`)
        }
        var userResObj= {
            name: user.name,
             userId: user.userId,
             email: user.email,
             userType: user.userType,
             userStatus: user.userStatus
        }
        res.status(200).send(userResObj);

    }catch(err){
           res.status(500).send({
               message: "Internal server error"
           })
    }
  }

 exports.update= async (req,res)=>{

    const userIdReq= req.params.userId;

    try{
        const user= await User.findOne({userId:userIdReq});

        if(!user){
            return res.status(200).send(`${userIdReq} does not exist in system`);
        }

        //for updating;

        const admin= await User.findOne({
            userType: "Admin"
        })
        user.name= req.body.name?req.body.name:user.name;
        user.userStatus= req.body.userStatus?req.body.userStatus:user.userStatus;
        user.userType= req.body.userType?req.body.userType:user.userType;

        if(admin.userId==req.userId){
            user.userStatus= req.body.userStatus;
        }

        const newUser= await user.save();


        const userResObj={
            name: newUser.name,
            userId: newUser.userId,
            email: newUser.email,
            userType: newUser.userType,
            userStatus: newUser.userStatus
        }
        res.status(200).send(userResObj);

    }catch(err){

    }



 }