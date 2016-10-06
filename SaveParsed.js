// var db = require('./db/db');
var parser = require('./parser');
var varriables = require('./varriables.js');
var nbrb={};

function saveParsed(){
    parser.parseFrom(varriables.conf, function (res) {
    	console.log(res);
    });
}

module.exports = {
    saveParsed: saveParsed
}
