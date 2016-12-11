/**
 * Created by weiqi on 2016/6/29.
 */
var mongoose=require('../db').mongoose;
var schema=new mongoose.Schema({
    username:{ type: String, required: true, unique: true },
    password:{ type: String, required: true},
    nikename:{ type: String},
    idnumber:{ type: String},
    phonenumber:{ type: String},
    status:{ type: String},
    last_login_time:{ type: String}
});

var User=mongoose.model('User',schema);
module.exports=User;