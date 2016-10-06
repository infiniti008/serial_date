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
			if (i == 'SeasonInfo') {
				var NextEpisode = {};
				NextEpisode.IndexSeason = res[i].match('сезон').index;
				NextEpisode.NumberSeason = (res[i].charAt(NextEpisode.IndexSeason-3) + res[i].charAt(NextEpisode.IndexSeason-2) + res[i].charAt(NextEpisode.IndexSeason-1)) * 1;
				NextEpisode.IndexEpisode = res[i].match('серия').index;
				NextEpisode.NumberEpisode = (res[i].charAt(NextEpisode.IndexEpisode-3) + res[i].charAt(NextEpisode.IndexEpisode-2) + res[i].charAt(NextEpisode.IndexEpisode-1)) * 1;
			}
		}
		console.log(NextEpisode);
		res.create = new Date();


		cb(res);
	});
}

module.exports = {
	parseFrom: parseFrom
}
