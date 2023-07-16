const Ticket= require('../models/ticket.model');
const User= require('../models/user.model');
const objectConverter= require('../utils/objectConverter');
const CONSTANTS= require('../utils/constants');

exports.createTicket= async (req,res)=>{

    const ticketObj= {
        title: req.body.title,
        description: req.body.description,
        ticketPriority: req.body.ticketPriority,
        status: req.body.status,
        reporter: req.userId
    }
    try{

        /**
         * logic to find engineer in the approved system
         */

        const engineer= await User.findOne({
            userType: "Engineer",
            userStatus: "Approved"
        })

        ticketObj.assignee= engineer.userId;

        const ticket = await Ticket.create(ticketObj);
        /**
         * Update customer and engineer data;
         */
        if(ticket){
            const user= await User.findOne({
                userId: req.userId
            })

        //customer:
          user.ticketsCreated.push(ticket._id);
          await user.save();
        //Engineer
          engineer.ticketsAssigned.push(ticket._id);
          await engineer.save();
        }
          
        /**
         * send notification to all the participants of this ticket
         */

        res.status(201).send(objectConverter.ticketResponse(ticket));

    }catch(err){
      console.log("Error during ticket creation");
       res.status(500).send({
           message: "Internal server error"
       })
    }
}

exports.findTicketById= async (req,res)=>{
    const idReq= req.params.id;
     try{
    const ticket= await Ticket.findOne({_id:idReq});

    if(!ticket){
        res.status(400).send(`No ticket exist with this id:${idReq}`)
    }
    res.status(200).send(objectConverter.ticketResponse(ticket));
}catch{
      res.status(500).send({
          message: "Internal server error-2.0"
      })
}
}


exports.updateTicket = async (req, res) => {

    const ticketIdReq = req.params.id;

    const ticket = await Ticket.findOne({ _id: ticketIdReq });

    if (!ticket) {
        res.status(404).send({
            message: `Ticket does not exist with ${ticketIdReq}`
        })
    }
    try {
        const loggedUser = await User.findOne({
            userId: req.userId
           
        })
        
        if (loggedUser.userId == ticket.reporter || loggedUser.userId == ticket.assignee ||
            loggedUser.userType == "Admin"){

            

            ticket.title = req.body.title != undefined ? req.body.title : ticket.title;
            ticket.description = req.body.description != undefined ? req.body.description : ticket.description;
            ticket.ticketPriority = req.body.ticketPriority != undefined ? req.body.ticketPriority : ticket.ticketPriority;
            ticket.status = req.body.status != undefined ? req.body.status : ticket.status;
            ticket.assignee = req.body.assignee != undefined ? req.body.assignee : ticket.assignee;


            const updatedTicket = await ticket.save();

            
            res.status(202).send(objectConverter.ticketResponse(updatedTicket));
        }else{
            res.status(401).send(
                {message:"Invalid credentials! Not eligible for update ticket."
            })
        }

    } catch (err) {
        res.status(500).send({
            message: "Internal server error."
        })

    }

}


exports.getAllTickets= async (req,res)=>{
 /**
  * Admin should show all tickets + can apply status filter.
  * Customers can get only tickets created by them.
  * Engineer should get tickets creted or assigned to them.
  */
    
    const queryObj= {};

    if(req.query.status!=undefined){
        queryObj.status=req.query.status
    }

    const loggedUser= await User.findOne({userId:req.userId});

    if(loggedUser.userType=="Engineer"){
        queryObj.assignee=req.userId;
    }else if(loggedUser.userType=="Customer"){
        queryObj.reporter=req.userId;
    }else{
        //Admin- do nothing;
    }

    const ticket=await Ticket.find(queryObj);
    res.status(200).send(ticket);

}