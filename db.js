var fs = require('fs');

var db_name = "serial.db";

//Создание базы данных
function create_db (cb) {
  var ind = 0;
    var exists = fs.existsSync(db_name);
    if (!exists) {
        ind = 1;
        console.log("Creating DB file: " + db_name);
        fs.openSync(db_name, "w");
    }
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database(db_name);
    db.serialize(function () {
        db.run("CREATE TABLE if not exists nextepisode (SerialUrl TEXT, SerialName TEXT, OriginalName TEXT, SerialSeason TEXT, NextEpNumber TEXT, NextEpName TEXT, NextEpDay TEXT, NextEpMonth TEXT, NextEpYear TEXT, LastScan TEXT)", function(){
          if (ind == 1) {
            add_first(cb);
          }
          else if (ind == 0) {
            cb();
          }
        });
    });

}

//Добавление нули в базу
function add_first (clb){
    var sqlite3 = require('sqlite3').verbose();
    var data_base = new sqlite3.Database(db_name);
    data_base.serialize(function() {
        var stmt = data_base.prepare("INSERT INTO nextepisode (SerialUrl, SerialName, OriginalName, SerialSeason, NextEpNumber, NextEpName, NextEpDay, NextEpMonth, NextEpYear, LastScan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        stmt.run('0', '0', '0', '0', '0', '0', '0', '0', '0', '0');
        // console.log(task);
        stmt.finalize();
        delet_from_base(1, function(){
          clb();
        });
    });
    data_base.close();
}

//Добавление новой за в базу
function add_next (next, cb){
  // console.log(next);
    var sqlite3 = require('sqlite3').verbose();
    var data_base = new sqlite3.Database(db_name);
    data_base.serialize(function() {
        var stmt = data_base.prepare("INSERT INTO nextepisode (SerialUrl, SerialName, OriginalName, SerialSeason, NextEpNumber, NextEpName, NextEpDay, NextEpMonth, NextEpYear, LastScan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        stmt.run(next.url, next.SerialName, next.OriginalName, next.NumberSeason, next.NumberEpisode, next.NameEpisode, next.Date, next.Month, next.Year, next.LastScan);
        // console.log(task);
        cb();
        stmt.finalize();
    });
    data_base.close();
}

//Извлечение данных из таблицы
function insert_from_base(cb){
    var sqlite3 = require('sqlite3').verbose();
    var data_base = new sqlite3.Database(db_name);
    data_base.serialize(function () {
        data_base.all("SELECT rowid AS id, SerialUrl, SerialName, OriginalName, SerialSeason, NextEpNumber, NextEpName, NextEpDay, NextEpMonth, NextEpYear, LastScan FROM nextepisode", function(err, row) {
            // cb(row);
            console.log(row);
        });
    });
    data_base.close();
}

//Удаление из базы
function delet_from_base(id, cb){
    var sqlite3 = require('sqlite3').verbose();
    var data_base = new sqlite3.Database(db_name);
    data_base.serialize(function () {
        data_base.run("DELETE FROM nextepisode WHERE rowid = "+id+"", function (lastID) {
          console.log('Удалили запись с ID = ' + id);
          cb();
        });
    });
    data_base.close();
}


module.exports = {
  create_db : create_db,
  insert_from_base : insert_from_base,
  delet_from_base : delet_from_base,
  add_next : add_next
}
