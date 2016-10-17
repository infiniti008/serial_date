var request = require('request');
var cheerio = require("cheerio");

parseFrom(function(list){
  console.log(list);
});

function parseFrom(cb){
	request('http://epscape.com/show', function(error, response, body) {
    if (!error) {
            var $ = cheerio.load(body);
            var serial = [];
            for (var i = 2; i < 252; i++) {
              var ser = {};
              ser.href = '';
              var hr = $("tr:nth-child(" + i + ") > td.td-show-name").html();
              var ind = hr.match('http').index;
              var fk = hr.indexOf('"');
              var sk = hr.indexOf('"', fk + 1);
              for (var j = fk + 1; j < sk; j++) {
                ser.href = ser.href + hr.charAt(j);
              }
              ser.status = $("tr:nth-child(" + i + ") > td.td-show-status").text();
              serial[i] = ser;
              if (i == 251) {
                cb(serial);
              }
            }
            // console.log(serial);
        } else {
            console.log("Произошла ошибка: " + error);
        }
	});
}
