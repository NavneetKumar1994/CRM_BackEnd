const Ticket= require('../models/ticket.model')


validateTicketReqBody= (req,res,next) =>{
    if(!req.body.title){
        res.status(400).send({
            message: "title is required"
        })
    }
    if(!req.body.description){
        res.status(400).send({
            message: "description is required"
        })
    }

    next();
}

const verifyReq= {
    validateTicketReq: validateTicketReqBody
}

module.exports= verifyReq;