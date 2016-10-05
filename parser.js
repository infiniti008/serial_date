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
				var CurrentSeason = {};
				CurrentSeason.IndexSeason = res[i].match('сезон').index;
				CurrentSeason.NumberSeason = (res[i].charAt(CurrentSeason.IndexSeason-3) + res[i].charAt(CurrentSeason.IndexSeason-2) + res[i].charAt(CurrentSeason.IndexSeason-1)) * 1;
				CurrentSeason.IndexEpisode = res[i].match('серия').index;
				CurrentSeason.NumberEpisode = (res[i].charAt(CurrentSeason.IndexEpisode-3) + res[i].charAt(CurrentSeason.IndexEpisode-2) + res[i].charAt(CurrentSeason.IndexEpisode-1)) * 1;
			}
		}
		console.log(CurrentSeason);
		res.create = new Date();


		cb(res);
	});
}

module.exports = {
	parseFrom: parseFrom
}
