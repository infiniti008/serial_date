var request = require('request');
var cheerio = require("cheerio");


function parseFrom(config, cb){
	request({
		uri : config.uri,
	}, function(error, response, body) {
		var $ = cheerio.load(body);
		var res = {};
		for (var i in config.selectors){
			res[i] = $(config.selectors[i]).text();
		}
		res.create = new Date();
		cb(res);
	});
}

module.exports = {
	parseFrom: parseFrom
}
