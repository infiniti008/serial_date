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
        db.add_next(NextEpisode, function(){
          console.log('Добавили добавили');
        });
      }
      else {
        console.log('Есть совпадение');
      }
    });

  });
}

function auto_scan(){
  var i = 0;
  db.insert_from_base('off', '', '', function(row){
    // console.log(row);
    j = row.length;
    add_i();
    function add_i(){
      if (i < j) {
        var configure = varriables.changeUrlInConf(row[i].SerialUrl);
        var id = row[i].id;
        console.log(id);
        parser.parseFrom(configure, function (NextEpisode) {
          // console.log(NextEpisode);
          db.update_to_base(id, NextEpisode, function(){
            console.log('Update id ' + id + ' success');
            i=i+1;
            add_i();
          });
        });
      }
    }
  });

}

module.exports = {
    saveParsed: saveParsed,
    saveParsedDb : saveParsedDb,
    auto_scan : auto_scan
}
