var TelegramBot = require('node-telegram-bot-api');
var fs = require('fs');
var db = require('../db.js')



function show_list(msg, match, bot, cb){
  var fromId = msg.from.id;
  var serial = '/serial_';
  var serial_current = {};
  db.insert_from_base('off', '', '', function(row){
    // console.log(row);
    var j;
    if (row.length > 5) {
      j = 5;
    }
    else {
      j = row.length;
    }
    for (var i = 0; i < j; i++) {
      serial_current[i] = row[i];
      bot.sendMessage(fromId, serial + i + ' ' + row[i].SerialName);
    }
    cb(serial_current);
  });
}



module.exports = {
  show_list : show_list,
}
