var mongoose=require('../db').mongoose;
var schema=new mongoose.Schema({
    username:{ type: String, required: true, unique: true },
    seq:{ type: Array},//sequence
    position:{ type: Number},
    name:{ type: String},
    create_time:{ type: String}
});

var Course=mongoose.model('Course',schema);
module.exports=Course;