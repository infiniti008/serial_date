var request = require('request');
var parser = require('./parser');
var express = require('express');
var fs = require('fs');
var SaveParsed = require('./SaveParsed');
var varriables = require('./varriables.js')
var db = require('./db.js')
var port = 3000;

// Создание базы, добавление в нее первой строчки с нулевыми значениями и моментальное ее удаление
db.create_db(function(){
  startServer();
});


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
      file = file.replace('{{Title}}', 'Главная страница');
      file = file.replace('{{in_div}}', 'Приветствую в интерактивной панели управления оборудованием!');
      res.end(file);
  });

  app.get('/add_url', function(req, res){
    console.log(req.query.url);
    SaveParsed.saveParsed(req.query.url);
  });
}



// app.set('view engine', 'jade');
// app.set('port', (process.env.OPENSHIFT_NODEJS_PORT || 5000));
// app.set('ip', (process.env.OPENSHIFT_NODEJS_IP || 'localhost'));
// app.use('/public', express.static('public'));
//
// app.get('/', function (req, res) {
//   res.render('index', { title: 'Hey', message: 'Hello there!'});
// });

// app.listen(app.get('port'), app.get('ip'), function() {
//   console.log('Node app is running on port', app.get('port'));
// });
