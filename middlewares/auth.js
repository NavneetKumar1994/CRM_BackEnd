const jwt= require('jsonwebtoken');
const secretConfig= require('../configs/auth.configs');
const User= require('../models/user.model');

verifyToken= (req,res,next)=>{

    let token= req.headers['x-access-token'];

    if(!token){
        return res.status(403).send('No token provided');
    }

    jwt.verify(token,secretConfig.secret,(err,decoded)=>{
        if(err){
            return res.status(401).send('Unauthorized');
        }

        req.userId= decoded.id;
        next(); 
    });
    
}
 //crate a middleware for check the admin, by 'req.userId' which just added in previous middleware,
 isAdmin= async (req,res,next)=>{
     const user= await User.findOne({
         userId: req.userId
})
     if(user && user.userType==="Admin"){
         next();
     }else{
         return res.status(403).send({
             message: "Require Admin role to access this feature."
         })
     }
 }

 //middleware that ensure the updator is "admin or owner" itself.

 checkUserType= async (req,res,next)=>{
    const loggedUser= await User.findOne({
        userId: req.userId,
})

   const userToUpdate= await User.findOne({
        userId: req.params.userId,
   })

    if(loggedUser && (loggedUser.userType==="Admin" || loggedUser.userId==req.params.userId )){
        next();
    }else{
        return res.status(403).send({
            message: "Require Admin or Owner to access this feature."
        })
    }
}

const authCheck= {
    verifyToken:verifyToken,
    isAdmin: isAdmin,
    checkUserType: checkUserType
}
module.exports= authCheck;