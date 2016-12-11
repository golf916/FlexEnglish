var settings=require("./settings");
var mongoose=require('mongoose');
//mongoose.Promise = global.Promise;
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://"+settings.ip+"/"+settings.db);
var db=mongoose.connection;

db.on('connected', function(){
    console.log('Connection success!');
});
db.on('error', function(err){
    console.log('Connection error: ' + err);
});
db.on('disconnected', function(){
    console.log('Connection disconnected');
});

module.exports={
    "dbCon":db,
    "mongoose":mongoose
};