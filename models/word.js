var mongoose=require('../db').mongoose;
var schema=new mongoose.Schema({
    name:{ type: String, required: true,unique: true },
    rank:{ type: String,default:"" },//1,2,3,4,5
});
var Word=mongoose.model('Word',schema);
module.exports=Word;