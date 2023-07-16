const userController= require('../controller/user.controller');
const authMiddleware= require('../middlewares/auth');


module.exports= function(app){
    app.get('/crm/api/v1/users',[authMiddleware.verifyToken,authMiddleware.isAdmin],userController.findAll);

    app.get("/crm/api/v1/users/:userId",[authMiddleware.verifyToken,authMiddleware.isAdmin], userController.findById);
   
    app.put("/crm/api/v1/users/:userId",[authMiddleware.verifyToken,authMiddleware.checkUserType], userController.update);

}