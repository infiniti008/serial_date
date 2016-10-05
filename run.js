var request = require('request');
var parser = require('./parser');
var SaveParsed = require('./SaveParsed');
var varriables = require('./varriables.js')
var express = require('express');

var app = express();
SaveParsed.saveParsed();

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
