var express = require('express');
var router = express.Router();
var rf=require("fs");
var lineReader = require('line-reader');
var Word=require('../models/word');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/random', function(req, res, next) {
  Word.find({type:'sentence'},function(err,words){
    if(err){
      res.statusCode = 500;
      res.json({ error: 'Server error'});
    }
    // res.json({words: words});
    // console.log("words :" + words);
    // var ramArr = shuffle(words);
    var ramArr = anotherShuffle(words);
    console.log("随机 :" + ramArr);
    res.render('listword', { title: '列表',words: ramArr });

  });
});

/* 读取文件，导入数据库. */
router.get('/file', function(req, res, next) {
  lineReader.eachLine('test0.txt', function(line, last) {
    console.log(line);
    var arrLine = separate(line);
    console.log("中文 :"+arrLine[0]);
    console.log("英文 :"+arrLine[1]);
    var newWord=new Word({
      english:arrLine[1],
      chinese:arrLine[0],
      type:'sentence',
      origin:'Collins'
    });
    newWord.save(function(err) {
      if (err) {
        console.log("error="+err);
      }
    });
    if(last){
      console.log("this is the last one"+last);
      res.render('index');
    }
  });
  // console.log("completed!");
});

/* 导出数据库. */

/* 搜索. */

/*
返回值：中文在前，英文在后
 */
function separate(str) {
  var arrStr = new Array("1","2");
  var len = 0;
  var first = str.charCodeAt(i);
  if(first < 256){
    for (var i = 1; i < str.length; i++) {
      var c = str.charCodeAt(i);
      if(c > 256){
        arrStr[1] = str.substring(0,i);
        arrStr[0] = str.substring(i,str.length);
        break;
      }
    }
  }else{
    for (var i = 1; i < str.length; i++) {
      var c = str.charCodeAt(i);
      if(c < 256){
        arrStr[0] = str.substring(0,i);
        arrStr[1] = str.substring(i,str.length);
        break;
      }
    }
  }
  return arrStr;
}

function shuffle(originalArray)
{
  while(originalArray.length > 0)
  {
    //generate a random index of the original array
    var randomIndex = parseInt(Math.random() * originalArray.length);
    var mixedArray = [];
    //push the random element into the mixed one, at the same time, delete the original element
    mixedArray.push(originalArray[randomIndex]);
    originalArray.splice(randomIndex, 1);
  }

  return mixedArray;
}
function anotherShuffle(originalArray)
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
