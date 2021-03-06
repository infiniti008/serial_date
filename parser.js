var request = require('request');
var cheerio = require("cheerio");
var month_to = require('./month_to_number.js');

function parseFrom(config, cb){
	request({
		uri : config.uri,
	}, function(error, response, body) {
		var NextEpisode = {};
		var Index = {};
		var $ = cheerio.load(body);
		var stat = $("div.col-12.next-episode-block > h2").text();
		if (!stat) {
			var status = 'Информации о следующем эпизоде нет';
			// console.log('Информации о следующем эпизоде нет');
			cb(NextEpisode, status);
		}
		else {
			var status = 'Информация о следующем эпизоде есть';
			var res = {};
			for (var i in config.selectors){
				res[i] = $(config.selectors[i]).text();
				if (i == 'SeasonInfo') {
					Index.IndexSeason = res[i].match('сезон').index;
					NextEpisode.NumberSeason = (res[i].charAt(Index.IndexSeason-3) + res[i].charAt(Index.IndexSeason-2) + res[i].charAt(Index.IndexSeason-1)) * 1;
					Index.IndexEpisode = res[i].match('серия').index;
					NextEpisode.NumberEpisode = (res[i].charAt(Index.IndexEpisode-3) + res[i].charAt(Index.IndexEpisode-2) + res[i].charAt(Index.IndexEpisode-1)) * 1;
				}
				else if (i == 'Time') {
					NextEpisode.Date = (res[i].charAt(0) + res[i].charAt(1)) * 1;
					Index.IndexYear = res[i].match('201').index;
					NextEpisode.Month = '';
					NextEpisode.Year = (res[i].charAt(Index.IndexYear) + res[i].charAt(Index.IndexYear+1) + res[i].charAt(Index.IndexYear+2) + res[i].charAt(Index.IndexYear+3)) * 1;
					for (var j = 3; j < Index.IndexYear -1; j++) {
						NextEpisode.Month = NextEpisode.Month + res[i].charAt(j);
					}
					NextEpisode.NameEpisode = '';
					for (var u = Index.IndexYear + 5; u < res[i].length; u++) {
						NextEpisode.NameEpisode = NextEpisode.NameEpisode + res[i].charAt(u);
					}
				}
			}
			res.create = new Date();
			NextEpisode.LastScan = res.create.getDate() + '-' + (res.create.getMonth() + 1) + '-' + (res.create.getYear() + 1900);
			NextEpisode.Month = month_to.monthToNumber(NextEpisode.Month);
			NextEpisode.SerialName = res.SerialName;
			NextEpisode.OriginalName = res.OriginalName;
			NextEpisode.Url = config.uri;
			console.log(NextEpisode);
			NextEpisode.create = new Date();
			cb(NextEpisode, status);
		}
	});
}

module.exports = {
	parseFrom: parseFrom
}
