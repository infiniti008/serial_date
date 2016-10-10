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
  // db.insert_from_base();
  var configure = varriables.changeUrlInConf(url);
  parser.parseFrom(configure, function (NextEpisode) {
  	// console.log(NextEpisode);
    db.insert_from_base('on', 'SerialName', NextEpisode.SerialName, function(row){
      if (row == '') {
        console.log('Нет совпадений');
        db.add_next(NextEpisode);
      }
      else {
        console.log('Есть совпадение');
      }
    });

  });
}
module.exports = {
    saveParsed: saveParsed,
    saveParsedDb : saveParsedDb
}
