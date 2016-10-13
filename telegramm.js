var TelegramBot = require('node-telegram-bot-api');
var fs = require('fs');
var db = require('./db.js')

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

bot.onText(/\/help/, function (msg, match) {
  var fromId = msg.from.id;
  var help = fs.readFileSync('./help.txt').toString();
  console.log(msg);
  bot.sendMessage(fromId, help);
  console.log('Показать справку');
});

bot.onText(/\/show/, function (msg, match) {
  var fromId = msg.from.id;
  db.insert_from_base('off', '', '', function(row){
    console.log(row);
    for (var i = 0; i < row.length; i++) {
      bot.sendMessage(fromId, row[i].SerialName);
    }
  });
});

// Any kind of message
bot.on('message', function (msg) {
  var chatId = msg.chat.id;
  if (msg.text.charAt(0) == '/') {
    console.log('Получили сервисное сообщение');
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
