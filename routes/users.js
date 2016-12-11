var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');



/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  res.render('word', { title: 'Express' });
});

// router.get('/adduser',function(req,res){
//     var md5=crypto.createHash('md5');
//     var password=md5.update('beta').digest('base64');
//     var newUser=new User({
//         username:'beta',
//         password:password,
//         nikename:'beta',
//         idnumber:'510321198012038808',
//         phonenumber:'18080881208',
//         status:'enabled'
//     });
//     User.findOne({name:newUser.name},function(err,user){
//         if(user){
//             err="用户名已经存在";
//             console.log(err);
//         }
//         if(err){
//             console.log(err);
//         }
//         newUser.save(function(err){
//             if(err){
//                 console.log(err);
//             }
//             res.redirect('/');
//         });
//     });
// });

module.exports = router;
