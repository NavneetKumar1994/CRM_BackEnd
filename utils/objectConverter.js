
exports.userResponse= (users)=>{
     let userResult= [];

     users.forEach(user => {
         userResult.push({
             name: user.name,
             userId: user.userId,
             email: user.email,
             userType: user.userType,
             userStatus: user.userStatus
         })
     });
     return userResult;
}

exports.ticketResponse= (ticket)=>{
    return {
        title: ticket.title,
        description: ticket.description,
        ticketPriority: ticket.ticketPriority,
        status: ticket.status,
        reporter: ticket.reporter,
        assignee: ticket.assignee,
        id: ticket._id,
        createdAt: ticket.createdAt,
        updateAt: ticket.updateAt
    }
}