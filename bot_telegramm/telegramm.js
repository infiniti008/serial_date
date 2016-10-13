var TelegramBot = require('node-telegram-bot-api');
var fs = require('fs');
var db = require('../db.js');
var show = require('./show.js');
var SaveParsed = require('../SaveParsed.js');

var show_later;
var show_info = 0;
var serial_current;

var token = '268377689:AAEehpljdqiY6qITewLNPUkbe60Kbszl95w';
// Setup polling way

function new_message(){


var bot = new TelegramBot(token, {polling: true});

// Matches /echo [whatever]
bot.onText(/\/echo (.+)/, function (msg, match) {
  var fromId = msg.from.id;
  var resp = match[1];
  console.log('Эхо сообщение');
  bot.sendMessage(fromId, resp);
});

bot.onText(/\/add/, function (msg, match) {
  var fromId = msg.from.id;
  console.log('Добавить сериал в базу');
});

bot.onText(/http:\/\/epscape.com\/show/, function (msg, match) {
  var fromId = msg.from.id;
  console.log('Добавили в базу');
  bot.sendMessage(fromId, 'Добавили в базу');
  console.log(msg.text);
  SaveParsed.saveParsedDb(msg.text);
});

bot.onText(/\/help/, function (msg, match) {
  var fromId = msg.from.id;
  var help = fs.readFileSync('./bot_telegramm/help.txt').toString();
  console.log(msg);
  bot.sendMessage(fromId, help);
  console.log('Показать справку');
});

//Показать список сериалов
bot.onText(/\/show_serial/, function (msg, match) {
  var fromId = msg.from.id;
  show.show_list(msg, match, bot, function(ser_curr){
    show_info = 1;
    serial_current = ser_curr;
    // console.log(serial_current);
  });
});

bot.onText(/\/serial_(.+)/, function (msg, match) {
  var fromId = msg.from.id;
  if (show_info == 1) {
    var ind = msg.text.charAt(8);
    var resp = 'Следующая, {{episode}}-ая серия, {{season}}-го сезона\nСериала "{{SerialName}}"\nВыходит {{day}}-{{month}}-{{year}}\nИ называется "{{epname}}""';
    resp = resp.replace('{{SerialName}}', serial_current[ind].SerialName);
    resp = resp.replace('{{season}}', serial_current[ind].SerialSeason);
    resp = resp.replace('{{episode}}', serial_current[ind].NextEpNumber);
    resp = resp.replace('{{epname}}', serial_current[ind].NextEpName);
    resp = resp.replace('{{day}}', serial_current[ind].NextEpDay);
    resp = resp.replace('{{month}}', serial_current[ind].NextEpMonth);
    resp = resp.replace('{{year}}', serial_current[ind].NextEpYear);
    bot.sendMessage(fromId, resp);
    show_info = 0;
  }
  else {
    bot.sendMessage(fromId, 'Сначала выберите /show_serial');
  }
});

// Any kind of message
bot.on('message', function (msg) {
  var chatId = msg.chat.id;
  if (msg.text.charAt(0) == '/') {
    console.log('Получили сервисное сообщение: ' + msg.text);
    // bot.sendMessage(chatId, 'Мы получили Ваш сервисное сообщение');
  }
  else if (msg.text.charAt(0) != '/') {
    console.log('Получили текст');
    bot.sendMessage(chatId, 'Мы получили Ваш сообщение');
  }
  else if (msg.photo) {
    console.log('Получили фото');
    bot.sendMessage(chatId, 'Мы получили Ваше фото');
  }
  else if (msg.document) {
    console.log('Получили файл');
    bot.sendMessage(chatId, 'Мы получили Ваш файл');
  }
  else if (msg.location) {
    console.log('Получили локацию');
    bot.sendMessage(chatId, 'Мы получили Вашу локацию');
  }
  else {
    bot.sendMessage(chatId, 'I do not know this! Try later!');
  }
});

}
module.exports = {
  new_message : new_message
}
