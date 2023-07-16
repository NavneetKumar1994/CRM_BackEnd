const mongoose= require('mongoose');
const validator= require('validator');

const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required:true,
    },
    userId:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                console.log("invalid Email");
            }
        }
        
    },
    createdAt:{
        type: Date,
        immutable:true,
        default: ()=>{
           return Date.now();
        }
    },
    updatedAt:{
        type: Date,
        default: ()=>{
           return Date.now();
        }
    },
    userType:{
        type: String,
        required: true,
        default: "Customer" 
    },
    userStatus:{
        type: String,
        required: true,
        default: "Approved" 
    },
    ticketsCreated:{
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "Ticket"
    },
    ticketsAssigned:{
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "Ticket"
    }

})

module.exports= mongoose.model("User",userSchema);