const mongoose= require('mongoose');


const commentSchema=new mongoose.Schema({
    content:{
        type: String,
        required:true
    },
    ticketId:{
        type:mongoose.SchemaTypes.ObjectId,
        required:true,
        ref: "Ticket"
    },
    commenterId:{
        type: String,
        required:true 
    },
},
  { timestamps:true,
    versionKey:false
  }  
)

module.exports= mongoose.model("Comment",commentSchema);