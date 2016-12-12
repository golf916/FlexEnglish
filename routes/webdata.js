/**
 * Created by Ricky on 2016/12/12.
 */
var express = require('express');
var router = express.Router();
var http = require("http");
var request = require("request");
var cheerio = require("cheerio");


/* GET home page. */
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




module.exports = router;