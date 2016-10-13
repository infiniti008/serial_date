var request = require('request');
var parser = require('./parser');
var express = require('express');
var fs = require('fs');
var SaveParsed = require('./SaveParsed');
var varriables = require('./varriables.js')
var db = require('./db.js')
var telegram = require('./bot_telegramm/telegramm.js');
var port = 3000;

// Создание базы, добавление в нее первой строчки с нулевыми значениями и моментальное ее удаление
db.create_db(function(){
  startServer();
});

  telegram.new_message();


// db.insert_from_base();

// SaveParsed.saveParsed();
function startServer(){
  var app = express();
  app.set('port', (process.env.OPENSHIFT_NODEJS_PORT || port));
  app.use(express.static(__dirname + '/public'));
  //Запуск сервера
  app.listen(app.get('port'),function(){
      console.log('Server run on port: ' + port);
  });
  //Главная страница
  app.get('/', function(req, res) {
      var file = fs.readFileSync('./views/home.html').toString();
      var first_page = fs.readFileSync('./views/first_page.html').toString();
      file = file.replace('{{Title}}', 'Главная страница');
      file = file.replace('{{content}}', first_page);
      res.end(file);
  });

  app.get('/add_page', function(req, res) {
      var file = fs.readFileSync('./views/home.html').toString();
      var add_page = fs.readFileSync('./views/add_page.html').toString();
      file = file.replace('{{Title}}', 'Добавить сериал');
      file = file.replace('{{content}}', add_page);
      res.end(file);
  });

  app.get('/list_page', function(req, res) {
      var file = fs.readFileSync('./views/home.html').toString();
      var list_page = fs.readFileSync('./views/list_page.html').toString();
      file = file.replace('{{Title}}', 'Добавить сериал');
      file = file.replace('{{content}}', list_page);
      res.end(file);
  });

  app.get('/deleteFromBase_page', function(req, res) {
    var file = fs.readFileSync('./views/home.html').toString();
    var deleteFromBase_page = fs.readFileSync('./views/deleteFromBase_page.html').toString();
    file = file.replace('{{Title}}', 'Главная страница');
    file = file.replace('{{content}}', deleteFromBase_page);
    res.end(file);
  });

  app.get('/deleteFromBase', function(req, res) {
    // console.log(req.query);
    db.delet_from_base(req.query.id, function(){
      console.log("after delete");
    });
    var file = fs.readFileSync('./views/home.html').toString();
    var deleteFromBase_page = fs.readFileSync('./views/deleteFromBase_page.html').toString();
    file = file.replace('{{Title}}', 'Главная страница');
    file = file.replace('{{content}}', deleteFromBase_page);
    res.end(file);
  });

  app.get('/2', function(req, res) {
    SaveParsed.auto_scan();
    var file = fs.readFileSync('./views/home.html').toString();
    var first_page = fs.readFileSync('./views/first_page.html').toString();
    file = file.replace('{{Title}}', 'Главная страница');
    file = file.replace('{{content}}', first_page);
    res.end(file);
  });

  app.get('/send_url', function(req, res){
    console.log('XMLHttpRequest');
    var new_url = req.query.urle;
    SaveParsed.saveParsedDb(new_url);
    var file = fs.readFileSync('./views/home.html').toString();
    var first_page = fs.readFileSync('./views/first_page.html').toString();
    file = file.replace('{{Title}}', 'Главная страница');
    file = file.replace('{{content}}', first_page);
    res.end(file);
  });

  app.get('/get_list', function(req, res) {
    db.insert_from_base('off', 'id', '1', function(row){
       res.send(row)
      //  console.log(row);
      console.log('Сканировали базу, отправили данные на сайт!');
    });
  });

//Рабочий
  // app.get('/send_url', function(req, res){
  //   console.log('XMLHttpRequest');
  //   var new_url = req.query.urle;
  //   SaveParsed.saveParsed(new_url);
  //   var file = fs.readFileSync('./views/home.html').toString();
  //   var first_page = fs.readFileSync('./views/first_page.html').toString();
  //   file = file.replace('{{Title}}', 'Главная страница');
  //   file = file.replace('{{content}}', first_page);
  //   res.end(file);
  // });

  // app.get('/add_url', function(req, res){
  //   console.log(req.query.url);
  //   SaveParsed.saveParsed(req.query.url);
  // });
}
