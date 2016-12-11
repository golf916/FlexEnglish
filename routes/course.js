var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
var Word=require('../models/word');
var Course=require('../models/course');


/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  res.render('word', { title: 'Express' });
});

/* create course according to rule. */
router.get('/createrule', function(req, res) {
  res.render('createrule', { title: 'Create Rule' });
});

/* add course by type. */
router.get('/addcoursebytype', function(req, res) {
  res.render('addcoursebytype', { title: 'Add Course By Type' });
});

/*
 * 建立一个课时，默认10条记录
 *
 * */
router.get('/add/:type',function(req,res){
  var course_seq = new Array();
  Word.find({type:req.params.type},function(err,words){
    for (var i = 0; i < words.length; i++) {
      course_seq[i] = words[i].id;
      if(i>8){
        break;
      }
    }
    console.log("course_seq:"+course_seq.length);
    var newCourse=new Course({
      username:'default',
      seq:course_seq,
      position:0,
      name:'first'
    });
    console.log("newCourse="+newCourse);
    newCourse.save(function(err) {
      if (err) {
        console.log("error="+err);
        return res.redirect('/');
      }
      console.log('success', '添加成功');
      res.redirect('/course/list');
    });

  });

});

/*
 查看list
 */
router.get('/list', function(req, res, next) {
  console.log("course id:"+req.params.id);
  Course.find(function (err, courses) {
    console.log("courses are:"+courses);
    if (!courses) {
      res.render('listcourse', { info: 'nothing' });
    }
    res.render('listcourse', { courses: courses });
  });
});

/*
 查看一条course
 */
router.get('/one/:id', function(req, res, next) {
  console.log("course id:"+req.params.id);
  Course.findById(req.params.id,function (err, course) {
    var arr = course.seq;
    console.log("first course.seq is:"+arr[0]);
    if(course.position != arr.length){
      Word.findById(arr[course.position],function (err, word) {
        console.log("word is:"+word);
        res.render('word', { word: word ,course: course});
      });
    }else{
      res.render('word', { info: '学习完成了' });
    }

  });
});

/*
 查看一条word
 */
router.get('/word',function(req,res){
  var cid=req.query.pid;
  var wid=req.query.wid;
  Word.findById(wid,function (err, word) {
    console.log("word id:"+word);
    res.render('word-all', { word: word ,cid:cid });
  });
});

/*
 查看course中的下一条word
 */
router.get('/next/:id', function(req, res, next) {
  console.log("course id:"+req.params.id);
  Course.findById(req.params.id,function (err, course) {
    var arr = course.seq;
    var position = course.position;
    if(position < arr.length-1){
      position ++;
      console.log("position is:"+position);
      console.log("arr[position] is:"+arr[position]);
      course.position = position;
      var _id = course._id; //需要取出主键_id
      delete course._id;    //再将其删除
      Course.update({_id:_id},course,function(err){
        console.log(" course is:"+course);
      });
      Word.findById(arr[position],function (err, word) {
        console.log("word is:"+word);
        res.render('word', { word: word ,course:course});
      });

    }else{
      console.log("2 position is:"+position);
      res.render('word', { info: '学习完成了' });
    }

  });
});

/*
 重新学习course
 */
router.get('/reset/:id', function(req, res, next) {
  console.log("course id:"+req.params.id);
  Course.findById(req.params.id,function (err, course) {
    course.seq = shuffle(course.seq);
    // console.log("first course.seq is:"+arr[0]);
    course.position = 0;
    var _id = course._id; //需要取出主键_id
    delete course._id;    //再将其删除
    Course.update({_id:_id},course,function(err){
      console.log(" course is:"+course);
      res.redirect("/course/list");
    });

  });
});

function shuffle(originalArray)
{
  var res = [];
  for (var i = 0, len = originalArray.length; i < len; i++) {
    var j = Math.floor(Math.random() * originalArray.length);
    res[i] = originalArray[j];
    originalArray.splice(j, 1);
  }
  return res;
}

module.exports = router;
