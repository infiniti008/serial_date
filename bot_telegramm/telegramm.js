var TelegramBot = require('node-telegram-bot-api');
var fs = require('fs');
var db = require('../db.js');
var show = require('./show.js');
var SaveParsed = require('../SaveParsed.js');

var show_later = 0;
var show_info = 0;
var serial_current;
var add = 0;
var after_add = {};
after_add.check = 0;

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
  add = 1;
  var fromId = msg.from.id;
  console.log('Добавить сериал в базу');
  bot.sendMessage(fromId, "Отправте мне ссылку на страницу сериала на ресурсе Escape.com \nСсылка должна быть вида 'http://epscape.com/show/Number/SerialName'");
});

bot.onText(/http:\/\/epscape.com\/show/, function (msg, match) {
  var fromId = msg.from.id;
  if (add == 1) {
    add = 0;
    // console.log('Добавили в базу');
    console.log(msg.text);
    SaveParsed.saveParsedDb(msg.text, function(stat, vb, url){
      console.log(url);
      after_add.url = url;
      after_add.check = 1;
      if (stat == 'Информация о следующем эпизоде есть') {
        if (vb == 'no') {
          bot.sendMessage(fromId, 'Мы добавили ваш сериал к нам в базу');
          bot.sendMessage(fromId, 'Для получения информации о добавленном сериале\nОтправьте /show_add');
        }
        else if (vb == 'yes') {
          bot.sendMessage(fromId, 'Такой сериал уже есть в нашей базе');
          console.log('send messege');
          bot.sendMessage(fromId, 'Для получения информации о добавленном сериале\nОтправьте /show_add');
        }
      }
      else {
        bot.sendMessage(fromId, stat);
      }
    });
  }
  else {
    bot.sendMessage(fromId, 'Для добавления сериала отправьте /add');
  }
});


bot.onText(/\/show_add/, function (msg, match) {
  var fromId = msg.from.id;
  console.log('Показать информацию о добавленном сериале ' + after_add.url);
  if (after_add.check == 1) {
    // bot.sendMessage(fromId, "ыкуекпвапвапвап");
    after_add.check = 0;
    db.insert_from_base('on', 'SerialUrl',   after_add.url, function(row){
      // console.log(row[0].SerialName);
      console.log('replace');
      var resp = 'Следующая, {{episode}}-ая серия, {{season}}-го сезона\nСериала "{{SerialName}}"\nВыходит {{day}}-{{month}}-{{year}}\nИ называется "{{epname}}""';
      resp = resp.replace('{{SerialName}}', row[0].SerialName);
      resp = resp.replace('{{season}}', row[0].SerialSeason);
      resp = resp.replace('{{episode}}', row[0].NextEpNumber);
      resp = resp.replace('{{epname}}', row[0].NextEpName);
      resp = resp.replace('{{day}}', row[0].NextEpDay);
      resp = resp.replace('{{month}}', row[0].NextEpMonth);
      resp = resp.replace('{{year}}', row[0].NextEpYear);
      console.log('send nessage');
      bot.sendMessage(fromId, resp);
    });
  }
  else {
    bot.sendMessage(fromId, 'Воспользуйтесь /add для добавления сериала');
  }
});


bot.onText(/\/help/, function (msg, match) {
  var fromId = msg.from.id;
  var help = fs.readFileSync('./bot_telegramm/help.txt').toString();
  // console.log(msg);
  bot.sendMessage(fromId, help);
  console.log('Показать справку');
});

//Показать список сериалов
bot.onText(/\/show_serial/, function (msg, match) {
  var fromId = msg.from.id;
  if (show_info == 0 || show_info == 2) {
    show.show_list(msg, match, bot, function(ser_curr, str){
      show_info = 1;
      serial_current = ser_curr;
      bot.sendMessage(fromId, str);
      // console.log(serial_current);
    });
  }
  else if (serial_current.length == 5){
    console.log('dfgdfgdfgdgf');
    console.log(serial_current[4].id);
    show.show_list_next(msg, match, bot, serial_current[4].id, function(ser_curr,str){
      show_info = 1;
      serial_current = ser_curr;
      bot.sendMessage(fromId, str);
      // console.log(serial_current);
    });
  }
  else {
    // console.log('dfgdfgdfgdgf');
    console.log(serial_current[4].id);
    show.show_list_next(msg, match, bot, serial_current[4].id, function(ser_curr, str){
      show_info = 2;
      serial_current = ser_curr;
      bot.sendMessage(fromId, str);
      // console.log(serial_current);
    });
  }
});

bot.onText(/\/serial_(.+)/, function (msg, match) {
  var fromId = msg.from.id;
  if (show_info != 0) {
    var ind = msg.text.charAt(8);
    var resp = 'Следующая, {{episode}}-ая серия, {{season}}-го сезона\nСериала "{{SerialName}}"\nВыходит {{day}}-{{month}}-{{year}}\nИ называется "{{epname}}"{{additional}}';
    resp = resp.replace('{{SerialName}}', serial_current[ind].SerialName);
    resp = resp.replace('{{season}}', serial_current[ind].SerialSeason);
    resp = resp.replace('{{episode}}', serial_current[ind].NextEpNumber);
    resp = resp.replace('{{epname}}', serial_current[ind].NextEpName);
    resp = resp.replace('{{day}}', serial_current[ind].NextEpDay);
    resp = resp.replace('{{month}}', serial_current[ind].NextEpMonth);
    resp = resp.replace('{{year}}', serial_current[ind].NextEpYear);
    resp = resp.replace('{{additional}}', '\n\nВы можете начать новый поиск используя /show_serial\nИли воспользуйтесь /help');
    bot.sendMessage(fromId, resp);
    show_info = 0;
    // bot.sendMessage(fromId, 'Начните новый поиск используя /show_serial');
  }
  else {
    bot.sendMessage(fromId, 'Сначала выберите /show_serial');
  }
});

// Any kind of message
bot.on('message', function (msg) {
  var chatId = msg.chat.id;
  var fromId = msg.from.id;
  var first_four = '';
  first_four = first_four + msg.text.charAt(0) + msg.text.charAt(1) + msg.text.charAt(2) + msg.text.charAt(3);
  console.log(first_four);
  if (msg.text.charAt(0) == '/') {
    console.log('Получили сервисное сообщение: ' + msg.text);
    // bot.sendMessage(chatId, 'Мы получили Ваш сервисное сообщение');
  }
  else if (first_four == 'http') {
    console.log('Получили ссылку');
    bot.sendMessage(chatId, 'Мы получили Вашу ссылку');
  }

  else if (msg.text.charAt(0) != '/') {
    console.log('Получили текст');
    bot.sendMessage(fromId, 'Попробуйте что-нибудь из этого');
    var help = fs.readFileSync('./bot_telegramm/help.txt').toString();
    // console.log(msg);
    bot.sendMessage(fromId, help);
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
