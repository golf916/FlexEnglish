var express = require('express');
var router = express.Router();
var Study=require('../models/study');

router.get('/', function(req, res, next) {
    res.render('study', { title: '主页' });
});

/*
 添加一条study
 */
router.post('/add', function(req, res) {
    var newStudy=new Study({
        english:req.body.english,
        chinese:req.body.chinese,
        group:req.body.group,
        type:req.body.type,
        origin:req.body.origin,
        rank:req.body.rank
    });
    console.log("study="+newStudy);
    newStudy.save(function(err) {
        if (err) {
            // req.flash('error', err);
            console.log("error="+err);
            return res.redirect('/add');
        }
        console.log('success', '添加成功');
        res.redirect('/study/list');
    });
});

/*
 编辑一条study
 */
router.post('/edit', function(req, res) {
    console.log("req.body.id="+req.body.id);
    Study.findById(req.body.id,function (err, study) {
        var _id = study._id; //需要取出主键_id
        delete study._id;    //再将其删除
        study.english=req.body.english;
        study.chinese=req.body.chinese;
        study.type=req.body.type;
        study.group=req.body.group;
        study.origin=req.body.origin;
        study.rank=req.body.rank;
        Study.update({_id:_id},study,function(err){
            console.log("edit study success! study is:"+study);
            res.redirect('/study/list');
        });
    });
});

/*
 添加一条study的界面
 */
router.get('/add', function(req, res, next) {
    // res.send('respond with a resource');
    res.render('addstudy', { title: '添加' });
});

/*
 编辑一条study的界面
 */
router.get('/edit/:id', function(req, res, next) {
    console.log("study id:"+req.params.id);
    Study.findById(req.params.id,function (err, study) {
        res.render('editstudy', { title: '编辑',study: study });
    });
});

/*
 查看一条study
 */
router.get('/view/:id',function(req,res){
    console.log("study id:"+req.params.id);
    Study.findById(req.params.id,function (err, study) {
        console.log("study id:"+study);
        res.render('study-single', { study: study });
    });
});

/*
 按type查看list
 */
router.get('/list/type/:type',function(req,res){
    console.log("req.params.type="+req.params.type);
    Study.find({type:req.params.type},function(err,studies){
        //console.log("study list by type:"+studies);
        res.render('liststudy', { title: '列表',studies: studies });
    });
});

/*
 按rank查看list
 */
router.get('/list/rank/:rank',function(req,res){
    console.log("req.params.rank="+req.params.rank);
    Study.find({rank:req.params.rank},function(err,studies){
        //console.log("study list by type:"+studies);
        res.render('liststudy', { title: '列表',studies: studies });
    });
});

/*
删除study
 */
router.get('/del/:id',function(req,res){
    console.log("delete id:"+req.params.id);
    Study.findById(req.params.id,function (err, study) {
        study.remove();
        res.redirect("/study/list");
    });
});

/*
 查看list
 */
router.get('/list',function(req,res){
    var page=req.query.page;
    var perpage=req.query.per_page;
    console.log("page="+page);
    console.log("perpage="+perpage);
    Study.find(function(err,studies){
        if (err) {
            // req.flash('error', err);
            console.log("error="+err);
            res.render('error', { error: err });
        }
        // res.json({studies: studies});
        res.render('liststudy', { title: '列表',studies: studies });
    });
});

/*
 查看list
 */
router.get('/list-admin',function(req,res){
    var page=req.query.page;
    var perpage=req.query.per_page;
    console.log("page="+page);
    console.log("perpage="+perpage);
    Study.find(function(err,studies){
        if (err) {
            // req.flash('error', err);
            console.log("error="+err);
            res.render('error', { error: err });
        }
        // res.json({studies: studies});
        res.render('liststudy-admin', { title: '列表',studies: studies });
    });
});



module.exports = router;