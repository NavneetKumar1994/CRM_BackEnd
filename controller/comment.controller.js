const Comment= require('../models/comment.model');

exports.createComment= async (req,res)=>{
      const commentReqObj={
          content: req.body.content,
          ticketId: req.params.ticketId,
          commenterId: req.userId
      }
      try{
          const comment= await Comment.create(commentReqObj);

          res.status(200).send(comment);

      }catch(err){
          console.log("Some error while creating comment",err);
          res.status(500).send({
              message: "Some internal server error"
          })

      }
}

exports.fetchComments= async (req,res)=>{
    try{
        const comments= await Comment.find({ticketId:req.params.ticketId})
        res.status(200).send(comments);

    }catch(err){
          console.log("Some error while creating comment",err);
          res.status(500).send({
              message: "Some internal server error"
          })

      }

}