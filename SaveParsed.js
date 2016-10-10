// var db = require('./db');
var parser = require('./parser.js');
var varriables = require('./varriables.js');
var db = require('./db.js');
var nbrb={};
//рабочий не трогать
function saveParsed(url){
  var configure = varriables.changeUrlInConf(url);
  // console.log(configure);
  parser.parseFrom(configure, function (NextEpisode) {
  	console.log(NextEpisode);

  });
}

//Дробавление в базу
function saveParsedDb(url){
  db.insert_from_base();
  // var configure = varriables.changeUrlInConf(url);
  // parser.parseFrom(configure, function (NextEpisode) {
  // 	// console.log(NextEpisode);
  //   db.add_next(NextEpisode, function(){
  //     db.insert_from_base();
  //   });
  // });
}
module.exports = {
    saveParsed: saveParsed,
    saveParsedDb : saveParsedDb
}
