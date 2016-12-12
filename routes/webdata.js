/**
 * Created by Ricky on 2016/12/12.
 */
var express = require('express');
var router = express.Router();
var http = require("http");
var request = require("request");
var cheerio = require("cheerio");
var Word=require('../models/word');
var Study=require('../models/study');

/* GET data from web. */
router.get('/pa/:word', function(req, res, next) {
	
	var url = "http://www.youdao.com/w/eng/"+req.params.word ;
	var options = {
		url: url,
		method: 'GET',
		charset: "utf-8",
		headers: {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.93 Safari/537.36"
		}
	};
    
    console.log("url is:" + url);
	var entity = [];
    request(options, function (error, response, body) {
        console.log("response is:" + response.statusCode);
        if (!error && response.statusCode == 200) {
            $ = cheerio.load(body);
			$('div.examples').each(function(i, elem) {
				entity[i] = $(this).text();
				console.log("number i="+i+"-"+entity[i]);
			});	
			console.log("length:"+entity.length);
        } else {
            console.log("没爬取到数据，再来一次");
        }
    });
    res.redirect('/index');
});

/* GET data from web according to word. */
router.get('/padata', function(req, res, next) {

	Word.find({ status: 'init'},function (err, words) {
		words.forEach(function(word,index){
			var url = "http://www.youdao.com/w/eng/"+word.name ;
			var options = {
				url: url,
				method: 'GET',
				charset: "utf-8",
				headers: {
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.93 Safari/537.36"
				}
			};
			console.log("url is:" + url);
			var entity = [];
			request(options, function (error, response, body) {
				console.log("response is:" + response.statusCode);
				if (!error && response.statusCode == 200) {
					$ = cheerio.load(body);
					$('div.examples').each(function(i, elem) {
						entity[i] = $(this).text();
						console.log("number i="+i+"-"+entity[i].trim());
						var arr =separate(entity[i].trim());

						var newStudy=new Study({
							english:arr[1],
							chinese:arr[0],
							type:'sentence',
							origin:'Collins',
							publisher:'padata',
						});

						newStudy.save(function(err) {
							if (err) {
								console.log("error="+err);
								return res.redirect('/add');
							}
							console.log('success', '添加成功');
						});
					});

					//将word的status设置为completed
					var _id = word._id; //需要取出主键_id
					delete word._id;    //再将其删除
					word.status='completed';
					Word.update({_id:_id},word,function(err){
						console.log("edit word success! word is:"+word);
					});
				} else {
					console.log("没爬取到数据，再来一次");
				}
			});

		});
	});

	res.redirect('/index');
});

/*
 返回值：中文在前，英文在后
 */
function separate(str) {
	var arrStr = new Array("1","2");
	var len = 0;
	var first = str.charCodeAt(0);
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

module.exports = router;