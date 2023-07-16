
const express= require('express')
const app= express();
const serverConfig= require('./configs/server.config')
const dbConfig= require('./configs/db.configs');
const mongoose= require('mongoose');
const bodyParser= require('body-parser');

app.use(bodyParser.json());
//above indicates that the dealing with client in form of json, as soon as it enters into server,
//converts into js object,and leaving in form of json again;
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect(dbConfig.DB_URL);
const db= mongoose.connection;

//using EventEmitter;
db.once("open",()=>{
     console.log("successfully connected to mongoDb") 
})
db.on('error',()=>{
    console.log("error while connecting to mongoDb");
    process.exit(); //kill the process and check the error; 
})

require('./routes/auth.route')(app);
require('./routes/user.route')(app);
require('./routes/ticket.route')(app);



app.listen(serverConfig.PORT,()=>{
    console.log(`server is running on port ${serverConfig.PORT}`);
})