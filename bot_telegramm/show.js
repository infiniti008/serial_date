var TelegramBot = require('node-telegram-bot-api');
var fs = require('fs');
var db = require('../db.js')



function show_list(msg, match, bot, cb){
  var fromId = msg.from.id;
  var serial = '/serial_';
  var serial_current = {};
  var str = '_______\n';
  str = str + '{{Serial_0}}\n{{Serial_1}}\n{{Serial_2}}\n{{Serial_3}}\n{{Serial_4}}';
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
      str = str.replace('{{Serial_' + i + '}}', serial + i + ' ' + row[i].SerialName);
    }
    str = str + '\n_______';
    str = str + '\n\nВыберите сериал из текущего сообщения\nили отправьте /show_serial для получения других сериалов'
    // bot.sendMessage(fromId, str);
    cb(serial_current, str);
  });
}


function show_list_next(msg, match, bot, id, cb){
  var fromId = msg.from.id;
  var serial = '/serial_';
  var serial_current = {};
  var str = '_______\n';
  db.insert_from_base_to_telegramm(id, function(row){
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
      if (i == 0) {
        str = str + serial + i + ' ' + row[i].SerialName
      }
      else {
        str = str + '\n' + serial + i + ' ' + row[i].SerialName
      }
      str = str + '\n_______';
      str = str + '\n\nСписок сериалов закончился! Начните поиск сначала используя /show_serial\nили добавьте сериал с помощью команды /add';
      // bot.sendMessage(fromId, str);
      // bot.sendMessage(fromId, serial + i + ' ' + row[i].SerialName);
    }
    cb(serial_current, str);
  });
}


module.exports = {
  show_list : show_list,
  show_list_next : show_list_next
}
