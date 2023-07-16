const ticketController = require('../controller/ticket.controller');
const commentController = require('../controller/comment.controller');
const authMiddleware = require('../middlewares/auth');
const verifyReqMiddleware = require('../middlewares/verifyTicketReqBody');


module.exports = function (app) {
    app.post('/crm/api/v1/ticket', [authMiddleware.verifyToken, verifyReqMiddleware.validateTicketReq], 
    ticketController.createTicket);

    app.put('/crm/api/v1/ticket/:id', [authMiddleware.verifyToken, verifyReqMiddleware.validateTicketReq], 
    ticketController.updateTicket)

    app.get('/crm/api/v1/ticket/:id',authMiddleware.verifyToken, 
    ticketController.findTicketById)

    app.get('/crm/api/v1/tickets',authMiddleware.verifyToken, 
    ticketController.getAllTickets)


    app.post('/crm/api/v1/tickets/:ticketId/comments',authMiddleware.verifyToken,
    commentController.createComment);

    app.get('/crm/api/v1/tickets/:ticketId/comments',authMiddleware.verifyToken,
    commentController.fetchComments);



}

