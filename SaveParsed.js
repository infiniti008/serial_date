// var db = require('./db/db');
var parser = require('./parser');
var varriables = require('./varriables.js');
var nbrb={};

function saveParsed(url){
  var configure = varriables.changeUrlInConf(url);
  // console.log(configure);
  parser.parseFrom(configure, function (NextEpisode) {
  	console.log(NextEpisode);
  });
}

module.exports = {
    saveParsed: saveParsed
}
