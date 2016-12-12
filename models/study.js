var mongoose=require('../db').mongoose;
var schema=new mongoose.Schema({
    english:{ type: String, required: true },
    chinese:{ type: String, required: true },
    type:{ type: String,default:""},//word,phrase,sentence,block
    group:{ type: String,default:""},//education,work,tech,env
    status:{ type: String,default:"enabled"},//enabled,disabled
    origin:{ type: String,default:""},//such as :Collins,Oxford
    comment:{ type: String,default:""},//
    publisher:{ type: String,default:"Ricky"},
    create_time: { type:Date, default:Date.now },
});
var Study=mongoose.model('Study',schema);
module.exports=Study;