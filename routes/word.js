var express = require('express');
var router = express.Router();
var Word=require('../models/word');

router.get('/', function(req, res, next) {
    res.render('word', { title: '主页' });
});

/*
 添加一条word的界面
 */
router.get('/add', function(req, res, next) {
    // res.send('respond with a resource');
    res.render('addword', { title: '添加' });
});

/*
 添加一条word
 */
router.post('/add', function(req, res) {
    var newWord=new Word({
        name:req.body.name,
        rank:req.body.rank
    });
    console.log("word="+newWord);
    newWord.save(function(err) {
        if (err) {
            // req.flash('error', err);
            console.log("error="+err);
            return res.redirect('/add');
        }
        console.log('success', '添加成功');
        res.redirect('/word/list');
    });
});

/*
 编辑一条word
 */
router.post('/edit', function(req, res) {
    console.log("req.body.id="+req.body.id);
    Word.findById(req.body.id,function (err, word) {
        var _id = word._id; //需要取出主键_id
        delete word._id;    //再将其删除
        word.name=req.body.name;
        word.rank=req.body.rank;
        Word.update({_id:_id},word,function(err){
            console.log("edit word success! word is:"+word);
            res.redirect('/word/list');
        });
    });
});

/*
 编辑一条word的界面
 */
router.get('/edit/:id', function(req, res, next) {
    console.log("word id:"+req.params.id);
    Word.findById(req.params.id,function (err, word) {
        res.render('editword', { title: '编辑',word: word });
    });
});

// /*
//  查看一条word
//  */
// router.get('/view/:id',function(req,res){
//     console.log("word id:"+req.params.id);
//     Word.findById(req.params.id,function (err, word) {
//         console.log("word id:"+word);
//         res.render('word', { word: word });
//     });
// });

/*
删除word
 */
router.get('/del/:id',function(req,res){
    console.log("delete id:"+req.params.id);
    Word.findById(req.params.id,function (err, word) {
        word.remove();
        res.redirect("/word/list");
    });
});

/*
 查看list
 */
router.get('/list',function(req,res){
    var page = req.query.page ? parseInt(req.query.page) : 1;
    var perpage=req.query.page ? parseInt(req.query.perpage) : 10;
    console.log("page="+page);
    console.log("perpage="+perpage);
    Word.find({}, null, {skip: (page-1)*perpage, limit: perpage}, function(err,words){
        if (err) {
            // req.flash('error', err);
            console.log("error="+err);
            res.render('error', { error: err });
        }
        // res.json({words: words});
        res.render('listword', { title: '列表',words: words });
    });
});



module.exports = router;